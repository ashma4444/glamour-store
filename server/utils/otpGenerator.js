// For TOTP
const { totp } = require("otplib");

totp.options = {
  step: +process.env.OTP_EXPIRE_IN_SECS,
};

const generateOtp = () => {
  return totp.generate(process.env.OTP_SECRET);
};

const checkOtp = (token) => {
  return totp.check(token, process.env.OTP_SECRET);
};

module.exports = { generateOtp, checkOtp };
