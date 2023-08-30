const config = require('../DbConfig');
const sql = require('mssql');
class CartController {
  async index(req, res) {}
  // [GET] /
  GetAllCart(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('MAKHACH', sql.VarChar(10), req.query.MAKHACH)
            .execute('dbo.KH_XEM_CT_GIOHANG')
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
      res.json(response?.recordset);
    });
  }

  // EDIT SO_LUONG
  UpdateQuantity(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      console.log(req.body.data);

      // create Request object
      var request = new sql.Request();
      request.input('MAKHACH', sql.VarChar(10), req.body.data.MAKHACH);
      request.input('MASP', sql.VarChar(10), req.body.data.MA_SP);
      request.input('STT', sql.Int, req.body.data.STT);
      request.input('SOLUONG', sql.Int, req.body.data.SO_LUONG);
      // query to the database and get the records
      request.execute('dbo.KH_UPDATE_CT_GIOHANG', function (err, response) {
        if (err) console.log(err);
        res?.json(response);
      });
    });
  }
  // [DELETE]
  RemoveFromCart(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('MAKHACH', sql.VarChar(10), req.body.MAKHACH)
            .input('MASP', sql.VarChar(10), req.body.MA_SP)
            .input('STT', sql.Int, req.body.STT)
            .execute('dbo.SP_KH_REMOVE_PRODUCT_FROM_CART')
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
      res.json(response);
    });
  }
}

module.exports = new CartController();
