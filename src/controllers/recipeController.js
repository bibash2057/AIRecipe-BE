const { generateRecipe } = require("../services/recipeService");
const validateJSON = require("../validations/validateJSON");

exports.generateRecipe = async (req, res) => {
  try {
    const { category, ingredients, servings, dietaryFocus } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Ingredients must be an array" });
    }

    if (ingredients.length === 0) {
      return res.status(400).json({
        error: "At least one ingredient is required",
      });
    }

    const recipe = await generateRecipe(
      category,
      ingredients,
      servings,
      dietaryFocus
    );

    // const jsonValidation = validateJSON(recipe);
    // console.log("jso", jsonValidation?.error, jsonValidation?.valid);
    // if (!jsonValidation.valid) {
    //   throw new Error(`Invalid JSON: ${jsonValidation?.error}`);
    // }

    res.json({
      data: recipe,
      message: "Succfully Get ALl ",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
