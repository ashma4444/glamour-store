const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (email, token) => {
  const msgOptions = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: "OTP Token", // Subject line
    html: `<div> Your OTP token is: ${token} </div>`,
  };
  const info = await transporter.sendMail(msgOptions);

  return info.messageId;
};

module.exports = sendMail;
