const ctl = require("../controllers/recipeController");

module.exports = (app) => {
  app.post(`${process.env.APP_URL}/recipes/generate`, ctl.generateRecipe);
};
