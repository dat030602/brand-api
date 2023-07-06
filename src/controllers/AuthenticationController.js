const config = require("../DbConfig");
const sql = require("mssql");
class HomeController {
	async index(req, res) {}
	// [POST] /login
	Login(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("username", sql.VarChar(10), req.body.user)
						.input("password", sql.VarChar(20), req.body.password)
						.execute("dbo.SP_LOGIN")
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
	// [POST] /register
	Register(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("fullname", sql.VarChar(10), req.body.fullname)
						.input("email", sql.VarChar(20), req.body.email)
						.input("phone", sql.VarChar(20), req.body.phone)
						.input("password", sql.VarChar(20), req.body.password)
						.execute("dbo.SP_REGISTER")
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
