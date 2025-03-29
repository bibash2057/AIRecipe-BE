const ctl = require("../controllers/ingredientCtrl");

module.exports = (app) => {
  app.get(`${process.env.APP_URL}/ingredient`, ctl.getAll);
};
