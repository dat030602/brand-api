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
						.query(`select * from voucher`)
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
			if (response?.recordset !== undefined) {
				var itemsInPage = 10;
				var id = req.query.id;
				var newData = [];
				for (let index = 0; index < response?.recordset.length; index++) {
					if (index >= itemsInPage * (id - 1) && index <= itemsInPage * (id - 1) + itemsInPage - 1) {
						const element = response?.recordset[index];
						newData.push(element);
					}
				}
				var size =
					response?.recordset.length % itemsInPage !== 0
						? parseInt(response?.recordset.length / itemsInPage) + 1
						: parseInt(response?.recordset.length / itemsInPage);
				res.json({ data: newData, lengthData: [size,response?.recordset.length] });
			}
		});
	}
}

module.exports = new ManageVouchersController();
