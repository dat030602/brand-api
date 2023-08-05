const uuid = require("uuid");
const config = require("../DbConfig");
const sql = require("mssql");

class ManageVouchersController {
	async index(req, res) {}
	// [GET]
	GetVouchers(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.query(`select * from voucher;select * from v_voucherUsed`)
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
			if (response?.recordsets === undefined) res.status(400);
			else if (response.recordsets.length === 0) res.status(400);
			else
				res.json(
					response.recordsets[0].map((el) => {
						return {
							voucher: el,
							history: response.recordsets[1].filter((el1) => {
								return el.voucher_id === el1.voucher_id;
							}),
						};
					})
				);
		});
	}
	// [POST]
	AddVoucher(req, res) {
		sql.connect(config, function (err) {
			if (err) console.log(err);

			let id = "";
			const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			const charactersLength = characters.length;
			let counter = 0;
			while (counter < 10) {
				id += characters.charAt(Math.floor(Math.random() * charactersLength));
				counter += 1;
			}
			// create Request object
			console.log(req.body.data)
			var request = new sql.Request();
			request.input("voucher_id", sql.VarChar(10), id);
			request.input("name_voucher", sql.NVarChar(10000), req.body.data.name_voucher);
			request.input("discount", sql.Int, req.body.data.discount);
			request.input("min_price", sql.Int, req.body.data.min_price);
			request.input("max_price", sql.Int, req.body.data.max_price);
			request.input("start_date", sql.DateTime, req.body.data.start_date);
			request.input("end_date", sql.DateTime, req.body.data.end_date);
			// query to the database and get the records
			request.execute("dbo.SP_ADD_VOUCHER", function (err, response) {
				if (err) res.json(err);
				else res.json(response);
			});
		});
	}
	// [PUT] /edit/ten-san-pham
	EditVoucher(req, res) {
		sql.connect(config, function (err) {
			if (err) console.log(err);

			// create Request object
			var request = new sql.Request();
			request.input("voucher_id", sql.VarChar(10), req.body.data.voucher_id);
			request.input("name_voucher", sql.NVarChar(10000), req.body.data.name_voucher);
			request.input("discount", sql.Int, req.body.data.discount);
			request.input("min_price", sql.Int, req.body.data.min_price);
			request.input("max_price", sql.Int, req.body.data.max_price);
			request.input("start_date", sql.DateTime, req.body.data.start_date);
			request.input("end_date", sql.DateTime, req.body.data.end_date);
			// query to the database and get the records
			request.execute("dbo.SP_EDIT_VOUCHER", function (err, response) {
				if (err) res?.json(err);
				else res?.json(response);
			});
		});
	}
	// [DELETE]
	DeleteVoucher(req, res) {
		const func = async () => {
			try {
				let result;
				await sql.connect(config).then((conn) =>
					conn
						.request()
						.input("voucher_id", sql.VarChar(10), req.body.voucher_id)
						.execute("dbo.SP_DELETE_VOUCHER")
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

module.exports = new ManageVouchersController();
