const { Schema, model } = require("mongoose");
const commonSchema = require("../../utils/commonSchema");

const { ObjectId } = Schema.Types;

const productSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, max: 1000, min: 1 },
  price: { type: Number, min: 1, max: 1000000 },
  description: { type: String, maxLength: 500 },
  images: [{ type: String }],
  category: { type: ObjectId, ref: "Category" },
  ...commonSchema,
});

module.exports = model("Product", productSchema);
