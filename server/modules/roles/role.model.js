const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Schema;
const commonSchema = require("../../utils/commonSchema");

const RoleSchema = new Schema({
  role: { type: String, required: true },
  user: { type: ObjectId, ref: "User" }, // foreign key - ref = "User" --> schema
  ...commonSchema, //destructure
});

module.exports = model("Role", RoleSchema);
