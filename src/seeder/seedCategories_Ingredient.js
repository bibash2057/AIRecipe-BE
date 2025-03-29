const Category = require("../models/Category");
const Ingredient = require("../models/Ingredient");
const categoriesData = require("../data/categories");
const { connect, disconnect } = require("../helper/db");
const ingredientsData = require("../data/ingredients");

const seedCategories = async () => {
  try {
    await connect();

    await Category.deleteMany({});
    await Ingredient.deleteMany({});
    console.log("Cleared existing data");

    const categoryMap = {};

    for (const categoryData of categoriesData) {
      const category = new Category(categoryData);
      await category.save();
      categoryMap[category.name] = category._id;
      console.log(`Created category: ${category.name}`);
    }

    for (const ingredientData of ingredientsData) {
      const categoryIds = ingredientData.categories.map(
        (categoryName) => categoryMap[categoryName]
      );

      const ingredient = new Ingredient({
        name: ingredientData.name,
        categories: categoryIds,
      });
      await ingredient.save();
      console.log(`Created ingredient: ${ingredient.name}`);

      for (const categoryId of categoryIds) {
        await Category.findByIdAndUpdate(
          categoryId,
          { $addToSet: { ingredients: ingredient._id } },
          { new: true }
        );
      }
    }
    console.log("Database seeded successfully!");
    await disconnect();
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};

seedCategories();
