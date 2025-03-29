const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("Ingredient", IngredientSchema);
