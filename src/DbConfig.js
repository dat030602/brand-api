const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

var config = {
  user: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: "tototete_",
  server: `${process.env.DB_SERVER_NAME}`,
  driver: "mssql",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};
module.exports = { config };
