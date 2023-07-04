const homeRouter = require("./Home");

function route(app) {
	app.use("/home", homeRouter);
}

module.exports = route;
