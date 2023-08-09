const homeRouter = require("./Home");
const authenticationRouter = require("./Authentication");
const manageProductsRouter = require("./ManageProducts");
const manageVouchersRouter = require("./ManageVouchers");
const voucherRouter = require("./Voucher");
const fileRouter = require("./File");
const searchRouter = require("./Search");
const cartRouter = require("./Cart");

function route(app) {
	app.use("/home", homeRouter);
	app.use("/file", fileRouter);
	app.use("/authentication", authenticationRouter);
	app.use("/manage-products", manageProductsRouter);
	app.use("/manage-vouchers", manageVouchersRouter);
	app.use("/voucher", voucherRouter);
	app.use("/search", searchRouter);
  app.use("/my-cart", cartRouter);
}

module.exports = route;
