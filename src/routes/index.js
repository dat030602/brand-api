const homeRouter = require("./Home");
const authenticationRouter = require("./Authentication");
const manageProductsRouter = require("./ManageProducts");
const fileRouter = require("./File");

function route(app) {
	app.use("/home", homeRouter);
	app.use("/file", fileRouter);
	app.use("/authentication", authenticationRouter);
	app.use("/manage-products", manageProductsRouter);
}

module.exports = route;
