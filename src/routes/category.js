const ctl = require("../controllers/categoryCtrl");

module.exports = (app) => {
  app.get(`${process.env.APP_URL}/category`, ctl.getAll);
};
