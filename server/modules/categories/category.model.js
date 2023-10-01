const { Schema, model } = require("mongoose");
const commonSchema = require("../../utils/commonSchema");

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, maxLength: 250 },
  ...commonSchema,
});

module.exports = model("Category", categorySchema);
