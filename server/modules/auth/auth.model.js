const { Schema, model } = require("mongoose");
const commonSchema = require("../../utils/commonSchema");

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: Number,
    required: true,
  },
  ...commonSchema,
});

module.exports = model("Auth", authSchema);
