const homeRouter = require("./Home");
const authenticationRouter = require("./Authentication");
const manageProductsRouter = require("./ManageProducts");
const manageVouchersRouter = require("./ManageVouchers");
const voucherRouter = require("./Voucher");
const favoriteRouter = require("./Favorite");
const fileRouter = require("./File");
const searchRouter = require("./Search");
const cartRouter = require("./Cart");
const productRouter = require("./Product");
const userRouter = require("./User");
const manageOrdersRouter = require("./ManageOrders");

function route(app) {
  app.use("/home", homeRouter);
  app.use("/file", fileRouter);
  app.use("/product", productRouter);
  app.use("/authentication", authenticationRouter);
  app.use("/manage-products", manageProductsRouter);
  app.use("/manage-vouchers", manageVouchersRouter);
  app.use("/favorite", favoriteRouter);
  app.use("/voucher", voucherRouter);
  app.use("/search", searchRouter);
  app.use("/my-cart", cartRouter);
  app.use("/user", userRouter);
  app.use("/manage-orders", manageOrdersRouter);
}

module.exports = route;
