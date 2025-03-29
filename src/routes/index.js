module.exports = (app) => {
  require("./category")(app);
  require("./Ingredient")(app);
  require("./recipe")(app);
};
