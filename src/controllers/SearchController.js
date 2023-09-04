const config = require("../DbConfig");
const sql = require("mssql");

class SearchController {
	async index(req, res) { }
	// [GET]
	GetAll(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result;
				await pool
					.request()
					.query(`SELECT * FROM dbo.SANPHAM DT join dbo.HINHANHSP H on DT.MA_SP = H.MA_SP join dbo.CT_SANPHAM CT on DT.MA_SP = CT.MA_SP join dbo.LOAISANPHAM L on DT.MA_LOAI_SP = L.MA_LOAI_SP
					where H.STT = 1 and CT.STT = 1`)
					.then((v) => {
						result = v;
					})
					.then(() => pool.close())
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
					.query(`SELECT * FROM dbo.SANPHAM DT where DT.TEN_SP like '%${req.query.key}%'`);
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
				let result
				await pool
					.request()
					.query(
						`SELECT * FROM dbo.SANPHAM DT join dbo.HINHANHSP H on DT.MA_SP = H.MA_SP join dbo.CT_SANPHAM CT on DT.MA_SP = CT.MA_SP join dbo.LOAISANPHAM L on DT.MA_LOAI_SP = L.MA_LOAI_SP
						where H.STT = 1 and CT.STT = 1 and L.TEN_LOAI_SP like '${req.query.category}'`
					)
					.then((v) => {
						result = v;
					})
					.then(() => pool.close())

				return result;
			} catch (error) {
				console.log(`Error: ${error}`);
			}
		};
		func().then((resReturn) => {
			res.json(resReturn?.recordset);
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
						`SELECT * FROM dbo.SANPHAM DT where DT.MA_LOAI_SP = '${req.query.type}' and DT.TEN_SP like '%${req.query.key}%'`
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
	GetAllBrand(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result;
				await pool
					.request()
					.query(`SELECT distinct BRAND FROM dbo.SANPHAM`)
					.then((v) => {
						result = v;
					})
					.then(() => pool.close())
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
	GetAll(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result;
				await pool
					.request()
					.query(`SELECT * FROM dbo.SANPHAM DT join dbo.HINHANHSP H on DT.MA_SP = H.MA_SP join dbo.CT_SANPHAM CT on DT.MA_SP = CT.MA_SP join dbo.LOAISANPHAM L on DT.MA_LOAI_SP = L.MA_LOAI_SP
					where H.STT = 1 and CT.STT = 1`)
					.then((v) => {
						result = v;
					})
					.then(() => pool.close())
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
	GetAllByFilter(req, res) {
		const func = async () => {
			try {
				let pool = await sql.connect(config);
				let result;
				await pool
					.request()
					.input("MA_LOAI_SP", sql.VarChar(10), req.query.type)
					.input("BRAND", sql.VarChar(30), req.query.brand)
					.input("PRICE", sql.VarChar(10), req.query.price)
					.input("RATING", sql.VarChar(10), req.query.rating)
					.execute("dbo.SP_FILTER_PRODUCTS")
					.then((v) => {
						result = v;
					})
					.then(() => pool.close())
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