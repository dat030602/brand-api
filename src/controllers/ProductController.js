const config = require("../DbConfig");
const sql = require("mssql");

class ProductController {
	async index(req, res) {}
	// [GET]
	GetProduct(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("masp", sql.VarChar(10), req.query.id)
						.input("makh", sql.VarChar(10), req.query.username)
						.execute("dbo.SP_GET_PRODUCT")
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
		func().then((response) => {
			res?.json(response?.recordsets);
		});
	}
}

module.exports = new ProductController();
