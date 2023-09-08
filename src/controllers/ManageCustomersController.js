require('../FirebaseConfig');
const firebase = require('firebase/storage');
const uuid = require('uuid');
const config = require('../DbConfig');
const sql = require('mssql');
const sign = require('jwt-encode');
const storage = firebase.getStorage();

class ManageCustomersController {
  async index(req, res) {}
  GetAllCustomers(req, res) {
    const func = async () => {
      try {
        let pool = await sql.connect(config);
        let result;
        await pool
          .request()
          .query(
            `select TEN_TK, HO_TEN, convert(varchar, NGAY_SINH, 107) as NGAY_SINH, EMAIL, SDT,DIEM_THUONG,COIN ,STATUS_ACCOUNT from dbo.KHACHHANG;
              select MA_KHACH,NGAYTAO,TONGTIEN,PHI_GIAO_HANG,GIAM_GIA,GIAM_GIA_GIAO_HANG from dondathang`,
          )
          .then((v) => {
            result = v;
          })
          .then(() => pool.close());
        return result;
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    func().then((resReturn) => {
      res.json(resReturn.recordsets);
    });
  }

  EditCustomer(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input('MaKH', sql.VarChar(10), req.body.data.makh)
      request.input('HoTen', sql.NVarChar(100), req.body.data.name)
      request.input('Email', sql.VarChar(30), req.body.data.email)
      request.input('Sdt', sql.Char(10), req.body.data.sdt)
      request.input('NgaySinh', sql.VarChar(15), req.body.data.date)
      request.input('Status', sql.Int, req.body.data.status)
      // query to the database and get the records
      request.execute('dbo.SP_EDIT_CUSTOMER', function (err, response) {
        if (err) console.log(err);
        res.json(response);
      });
    });
  }
  GetData(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
						.input("date", sql.DateTime, req.query.date)
            .execute('dbo.SP_Get_DashBoard')
            .then((v) => {
              result = v;
            })
            .then(() => conn.close()),
        );
        return result;
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    func().then((response) => {
      if (response?.recordsets.length !== 0){
        res.json({
          countCustomers: response?.recordsets[0][0].count,
          // countProducts: response?.recordsets[1][0].count,
          // countOrders: response?.recordsets[2][0].count,
          // countVouchers: response?.recordsets[3][0].count,
          // countCustomersYoung: response?.recordsets[4][0].count,
          // countCustomersOld: response?.recordsets[5][0].count,
          listCustomers: response?.recordsets[1],
        })
      }
      else res.json(response?.recordsets);
    });
  }
}

module.exports = new ManageCustomersController();