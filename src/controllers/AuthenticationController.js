const config = require("../DbConfig");
const sql = require("mssql");
const sign = require("jwt-encode");

class AuthenticationController {
	async index(req, res) {}
	// [POST] /login
	Login(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("username", sql.VarChar(10), req.body.data.user.toUpperCase())
						.input("password", sql.VarChar(1000), req.body.data.password)
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
		func().then((response) => {
			res.json(response);
		});
	}
	// [POST] /register
	Register(req, res) {
		const func = async () => {
			try {
				let result;
				const secret = "EgZjaHJvbWUyBggAEEUYOTIMCAEQABgUGIcCGIAEMgcIAhAAGIAEMgwIAxAA";
				const jwt = sign(req.body.data, secret);
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("tentk", sql.VarChar(10), req.body.data.user.toUpperCase())
						.input("hoten", sql.NVarChar(100), req.body.data.name)
						.input("ngaysinh", sql.Date, req.body.data.date)
						.input("email", sql.VarChar(30), req.body.data.email)
						.input("sdt", sql.Char(10), req.body.data.phone)
						.input("password", sql.VarChar(1000), req.body.data.password)
						.input("token", sql.VarChar(1000), jwt)
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
		func().then((response) => {
			res.json(response);
		});
	}
	// [GET] /
	Profile(req, res) {
		const func = async () => {
			try {
				var result
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.query(`select * from dbo.khachhang where ten_tk='${req.query.user}'`)
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
			res.json(response?.recordset);
		});
	}
	// [PUT] /
	EditProfile(req, res) {
		const func = async () => {
			try {
				var result
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("tentk", sql.VarChar(10), req.body.data.username.toUpperCase())
						.input("hoten", sql.NVarChar(100), req.body.data.name)
						.input("ngaysinh", sql.Date, req.body.data.date)
						.input("email", sql.VarChar(30), req.body.data.email)
						.input("sdt", sql.Char(10), req.body.data.phone)
						.execute("dbo.SP_EDIT_PROFILE")
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
			res.json(response);
		});
	}
}

module.exports = new AuthenticationController();
