const homeRouter = require("./Home");
const authenticationRouter = require("./Authentication");
const manageProductsRouter = require("./ManageProducts");

function route(app) {
  app.use("/home", homeRouter);
  app.use("/authentication", authenticationRouter);
  app.use("/manage-products", manageProductsRouter);
}

module.exports = route;
