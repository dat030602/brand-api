const config = require('../DbConfig');
const sql = require('mssql');

class ProductController {
  async index(req, res) {}
  // [GET]
  GetProduct(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('masp', sql.VarChar(10), req.query.id)
            .input('makh', sql.VarChar(10), req.query.username)
            .execute('dbo.SP_GET_PRODUCT')
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
      res?.json(response?.recordsets);
    });
  }
  // [POST] /add-to-cart
  AddToCart(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('username', sql.VarChar(10), req.body.data.username)
            .input('masp', sql.VarChar(10), req.body.data.data.MA_SP)
            .input('stt', sql.Int, req.body.data.data.STT)
            .input('soluong', sql.Int, req.body.data.data.soluong)
            .execute('dbo.SP_AddToCart')
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
      res?.json(response?.returnValue);
    });
  }
  // [POST]
  Favorite(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('username', sql.VarChar(10), req.body.data.username)
            .input('masp', sql.VarChar(10), req.body.data.id)
            .execute('dbo.SP_Favorite')
            .then((v) => {
              result = v;
			  console.log(result)
            })
            .then(() => conn.close()),
        );
        return result;
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    func().then((response) => {
      res?.json(response?.returnValue);
    });
  }
}

module.exports = new ProductController();
