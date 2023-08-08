const homeRouter = require("./Home");
const authenticationRouter = require("./Authentication");
const manageProductsRouter = require("./ManageProducts");
const fileRouter = require("./File");
const searchRouter = require("./Search");
const cartRouter = require("./Cart");

function route(app) {
  app.use("/home", homeRouter);
  app.use("/file", fileRouter);
  app.use("/my-cart", cartRouter);
  app.use("/authentication", authenticationRouter);
  app.use("/manage-products", manageProductsRouter);
  app.use("/search", searchRouter);

  // app.use("/my-cart", cartRouter);
}

module.exports = route;
