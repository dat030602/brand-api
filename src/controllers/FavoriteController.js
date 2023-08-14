const config = require("../DbConfig");
const sql = require("mssql");

class FavoriteController {
	async index(req, res) {}
	// [GET]
	GetProducts(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("makh", sql.VarChar(10), req.query.username)
						.execute("dbo.SP_GET_PRODUCTS_FAVORITE")
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
	// [DELETE]
	DeleteFavorite(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("masp", sql.VarChar(10), req.body.id)
						.input("username", sql.VarChar(10), req.body.username)
						.execute("dbo.SP_DELETE_Favorite")
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
			res?.json(response);
		});
	}
}

module.exports = new FavoriteController();
