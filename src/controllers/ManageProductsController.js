const config = require("../DbConfig");
const sql = require("mssql");
class HomeController {
	async index(req, res) {}
	// [GET]
	GetProducts(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.query(`SELECT * FROM dbo.DOITAC DT`)
						.then((v) => {
							result = v;
						})
						.then(() => conn.close())
				);
				return result;
			} catch (error) {
				console.log(`Error: ${error}`);
			}
		};
		func().then((resReturn) => {
			res.json(resReturn.recordset);
		});
	}
	// [POST]
	AddProduct(req, res) {
		sql.connect(config, function (err) {
			if (err) console.log(err);

			// create Request object
			var request = new sql.Request();
			request.input("id", sql.VarChar(10), req.body.data.id);
			request.input("name", sql.VarChar(20), req.body.data.name);
			request.input(
				"description",
				sql.VarChar(20),
				req.body.data.description
			);
			request.input("category", sql.VarChar(20), req.body.data.category);
			// query to the database and get the records
			request.execute("dbo.SP_ADD_PRODUCT", function (err, returnValue) {
				if (err) console.log(err);

				console.log(returnValue);
				// send records as a response
				// res.send(recordset);
			});
			for (let index = 0; index < req.body.data.detail.length; index++) {
				const element = req.body.data.detail[index];
				request = new sql.Request();
				request.input("id", sql.VarChar(10), element.id);
				request.input("name", sql.VarChar(20), element.name);
				request.input("stock", sql.VarChar(20), element.stock);
				request.input("image", sql.VarChar(20), element.image);
				// query to the database and get the records
				request.execute(
					"dbo.SP_ADD_DETAIL_PRODUCT",
					function (err, returnValue) {
						if (err) console.log(err);

						console.log(returnValue);
						// send records as a response
						// res.send(recordset);
					}
				);
			}
		});
	}
	// [PUT]
	EditProduct(req, res) {
		sql.connect(config, function (err) {
			if (err) console.log(err);

			// create Request object
			var request = new sql.Request();
			request.input("id", sql.VarChar(10), req.body.data.id);
			request.input("name", sql.VarChar(20), req.body.data.name);
			request.input(
				"description",
				sql.VarChar(20),
				req.body.data.description
			);
			request.input("category", sql.VarChar(20), req.body.data.category);
			// query to the database and get the records
			request.execute("dbo.SP_EDIT_PRODUCT", function (err, returnValue) {
				if (err) console.log(err);

				console.log(returnValue);
				// send records as a response
				// res.send(recordset);
				res.send(returnValue);
			});
		});
	}
	// [PUT] /edit-detail-product
	EditDetailProduct(req, res) {
		sql.connect(config, function (err) {
			if (err) console.log(err);

			// create Request object
			var request = new sql.Request();
			request.input("id", sql.VarChar(10), req.body.data.id);
			request.input("stt", sql.VarChar(10), req.body.data.stt);
			request.input("name", sql.VarChar(20), req.body.data.name);
			request.input(
				"price",
				sql.VarChar(20),
				req.body.data.price
			);
			request.input("stock", sql.VarChar(20), req.body.data.stock);
			// query to the database and get the records
			request.execute("dbo.SP_EDIT_DETAIL_PRODUCT", function (err, returnValue) {
				if (err) console.log(err);

				console.log(returnValue);
				// send records as a response
				res.send(returnValue);
			});
		});
	}
	// [DELETE]
	DeleteProduct(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("id", sql.VarChar(10), req.body.id)
						.execute("dbo.SP_DELETE_PRODUCT")
						.then((v) => {
							result = v;
						})
						.then(() => conn.close())
				);
				return result;
			} catch (error) {
				console.log(`Error: ${error}`);
			}
		};
		func().then((resReturn) => {
			res.json(resReturn);
		});
	}
}

module.exports = new HomeController();
