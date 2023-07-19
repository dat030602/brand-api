const config = require("../DbConfig");
const sql = require("mssql");
class HomeController {
	async index(req, res) {}
	// [GET] /home/getBranch1
	getBranch1(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.query(
							`SELECT * FROM dbo.KHACHHANG`
						)
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
}

module.exports = new HomeController();
