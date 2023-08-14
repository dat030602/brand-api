const homeRouter = require("./Home");
const authenticationRouter = require("./Authentication");
const manageProductsRouter = require("./ManageProducts");
const fileRouter = require("./File");
const userRouter = require("./User");

function route(app) {
  app.use("/home", homeRouter);
  app.use("/file", fileRouter);
  app.use("/authentication", authenticationRouter);
  app.use("/manage-products", manageProductsRouter);
  app.use("/user", userRouter);
}

module.exports = route;
