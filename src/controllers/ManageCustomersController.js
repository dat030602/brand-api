require('../FirebaseConfig');
const firebase = require('firebase/storage');
const uuid = require('uuid');
const config = require('../DbConfig');
const sql = require('mssql');

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
            `select TEN_TK, HO_TEN, convert(varchar, NGAY_SINH, 107) as NGAY_SINH, EMAIL, SDT,COIN from dbo.KHACHHANG;
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
}

module.exports = new ManageCustomersController();
