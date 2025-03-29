const Ingredient = require("../models/Ingredient");

exports.getAll = async (req, res) => {
  try {
    const allIngredient = await Ingredient.find({});
    res.status(200).json({
      data: allIngredient,
      message: "Succfully Get ALl ",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
