const bcrypt = require("bcrypt");
const saltRounds = 10;
const Model = require("./user.model");

const create = async (payload) => {
  const { password, ...rest } = payload;
  rest.password = await bcrypt.hash(password, saltRounds);

  return Model.create(rest);
};

const login = async (email, password) => {
  const userExists = await Model.findOne({ email }); // userExists gives tyo email vako user ko password
  if (!userExists) throw new Error("User not found ...");

  const result = await bcrypt.compare(password, userExists?.password);

  if (!result) throw new Error("Email or password is invalid");

  return result;
};

module.exports = { create, login };
