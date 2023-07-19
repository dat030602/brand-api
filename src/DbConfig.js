const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
module.exports = {
	user: `${process.env.DB_USERNAME}`,
	password: `${process.env.DB_PASSWORD}`,
	database: `${process.env.DB_NAME}`,
	server: `${process.env.DB_SERVER_NAME}`,
	driver: "mssql",
	options: {
		trustedConnection: true,
		trustServerCertificate: true,
	},
};
