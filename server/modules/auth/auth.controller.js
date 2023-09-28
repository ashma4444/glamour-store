const bcrypt = require("bcrypt");

const authModel = require("./auth.model");
const { generateOtp, checkOtp } = require("../../utils/otpGenerator");
const { generateJWTToken, verifyToken } = require("../../utils/jwtGenerator");
const sendMail = require("../../services/mailer");
const userModel = require("../users/user.model");

const create = async (payload) => {
  const { password, roles, ...rest } = payload;
  rest.password = await bcrypt.hash(password, +process.env.SALTS_ROUND);
  const user = await userModel.create(rest);

  const otp = await generateOtp();
  await authModel.create({ email: user?.email, token: +otp });

  //   send otp mail
  const mail = await sendMail(user?.email, otp);

  return mail;
};

const login = async (email, password) => {
  const user = await userModel
    .findOne({ email, isArchived: false })
    .select("+password"); // user gives tyo email vako user ko object
  if (!user) throw new Error("User not found ...");

  //   check if email exists or is verified
  if (!user.isEmailVerified) throw new Error("Email is not verified");

  //   check if user is active
  if (!user.isActive) throw new Error("User account status is inactive");

  const result = await bcrypt.compare(password, user?.password);

  console.log(result);

  if (!result) throw new Error("Email or password is invalid");

  const token = generateJWTToken({
    email: user?.email,
    roles: user?.roles ?? [],
  });

  return { token };
};

const verifyEmail = async (email, token) => {
  const user = await authModel.findOne({ email }); // user gives tyo email vako user ko object
  const userStatus = await userModel.findOne({ email }); // user gives tyo email vako user ko object
  if (!userStatus) throw new Error("User does not exists");

  if (userStatus.isEmailVerified) throw new Error("User is already verified");

  const isValidOtp = checkOtp(token);
  if (!isValidOtp) throw new Error("OPT token expired");

  if (!(+token === user?.token)) throw new Error("Token mismatched");

  await userModel.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );

  await authModel.deleteOne({ email });

  return true;
};

const regenerateToken = async (email) => {
  const user = await authModel.findOne({ email });

  if (!user) throw new Error("User already verified");

  const otp = await generateOtp();
  await authModel.findOneAndUpdate({ email }, { token: +otp });

  //   send otp mail
  await sendMail(email, otp);

  return true;
};

const generateFPToken = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User does not exists");

  const otp = await generateOtp();
  await authModel.create({ email: user?.email, token: +otp });

  //   send otp mail
  const mail = await sendMail(user?.email, otp);

  return mail;
};

const forgotPassword = async (email, token, password) => {
  const user = await authModel.findOne({ email }); // user gives tyo email vako user ko object
  if (!user) throw new Error("User does not exists");

  const isValidOtp = checkOtp(token);
  if (!isValidOtp) throw new Error("OPT token expired");

  if (!(+token === user?.token)) throw new Error("Token mismatched");

  await userModel.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(password, +process.env.SALTS_ROUND) },
    { new: true }
  );

  await authModel.deleteOne({ email });

  return true;
};

module.exports = {
  create,
  forgotPassword,
  generateFPToken,
  login,
  regenerateToken,
  verifyEmail,
};
