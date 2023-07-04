const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const route = require("./routes");
const sql = require('mssql');
var app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

route(app);

var port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`backend is running on http://localhost:${port}`);
});
