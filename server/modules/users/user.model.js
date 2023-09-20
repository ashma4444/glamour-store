const { Schema, model } = require("mongoose");
const commonSchema = require("../../utils/commonSchema");

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new Schema({
  name: { type: String, required: "Full name is required" },
  email: {
    type: String,
    trim: true, // remove white space
    lowercase: true, // convert all to lowercase
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true, required: true },
  ...commonSchema,
});

module.exports= model("User", userSchema);
