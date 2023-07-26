const config = require("../DbConfig");
const sql = require("mssql");

class SearchController {
    async index(req, res) {}
    	// [GET]
	GetAll(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result = pool.request().query(`SELECT * FROM dbo.SANPHAM DT`);
				return result;
			} catch (error) {
				console.log(`Error: ${error}`);
			}
		};
		func().then((resReturn) => {
			res.json(resReturn.recordset);
		});
	}
	// [GET]
	GetList(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result = pool
					.request()
					.query(`SELECT * FROM dbo.SANPHAM DT where DT.TEN_SP like '%${req.params.slug}%'`);
				return result;
			} catch (error) {
				console.log(`Error: ${error}`);
			}
		};
		func().then((resReturn) => {
			res.json(resReturn.recordset);
		});
	}
	// [GET]
	GetProductsByCategory(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result = pool
					.request()
					.query(
						`SELECT * FROM dbo.SANPHAM DT join dbo.LOAISANPHAM L on DT.MA_LOAI_SP = L.MA_LOAI_SP where L.MA_LOAI_SP = '${req.params.slug}'`
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
	// [GET]
	GetListByCategory(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result = pool
					.request()
					.query(
						`SELECT * FROM dbo.SANPHAM DT join dbo.LOAISANPHAM L on DT.MA_LOAI_SP = L.MA_LOAI_SP where L.MA_LOAI_SP = '${req.params.slug}' and DT.TEN_SP like '%${req.params.slug1}%'`
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

module.exports = new SearchController();