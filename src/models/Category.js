const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
});

module.exports = mongoose.model("Category", CategorySchema);
