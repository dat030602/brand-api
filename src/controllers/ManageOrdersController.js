require('../FirebaseConfig');
const firebase = require('firebase/storage');
const uuid = require('uuid');
const config = require('../DbConfig');
const sql = require('mssql');

const storage = firebase.getStorage();

class ManageOrdersController {
  async index(req, res) {}
  // [GET]
  GetAllOrders(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .execute('dbo.SP_GET_ALL_ORDER')
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

  // [GET]
  GetOrderDetail(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('MA_DONHANG', sql.VarChar(10), req.params.slug)
            .execute('dbo.SP_GET_ONE_ORDER_DETAIL')
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
    func().then((resReturn) => {
      res.json(resReturn.recordset);
    });
  }

  UpdateOrderStatus(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      console.log(req.body.data);

      // create Request object
      var request = new sql.Request();
      request.input('MA_DONHANG', sql.VarChar(10), req.params.slug);
      request.input('TRANGTHAI', sql.VarChar(3000), req.params.slug1);

      request.execute('dbo.SP_UPDATE_ORDER_STATUS', function (err, response) {
        if (err) console.log(err);
        res?.json(response);
      });
    });
  }

  // [GET]
  GetOrderRefundRequest(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('MA_DONHANG', sql.VarChar(10), req.params.slug)
            .execute('dbo.SP_GET_ONE_ORDER_REFUND_REQUEST')
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
    func().then((resReturn) => {
      res.json(resReturn.recordset);
    });
  }

  GetRefundDetail(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('MA_DONHANG', sql.VarChar(10), req.params.slug)
            .execute('dbo.SP_GET_ONE_ORDER_REFUND_REQUEST_DETAIL')
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
    func().then((resReturn) => {
      res.json(resReturn.recordset);
    });
  }

  UpdateRefundStatus(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      console.log(req.body.data);

      // create Request object
      var request = new sql.Request();
      request.input('MA_DONHANG', sql.VarChar(10), req.body.data.orderid);
      request.input('TRANGTHAIDONHANG', sql.NVarChar(3000), req.body.data.orderstatus);
      request.input('TRANGTHAIHOANTRA', sql.NVarChar(3000), req.body.data.refundstatus);

      request.execute('dbo.SP_UPDATE_ORDER_REFUND_STATUS', function (err, response) {
        if (err) console.log(err);
        res?.json(response);
      });
    });
  }
}

module.exports = new ManageOrdersController();
