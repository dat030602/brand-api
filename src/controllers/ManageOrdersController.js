require("../FirebaseConfig");
const firebase = require("firebase/storage");
const uuid = require("uuid");
const config = require("../DbConfig");
const sql = require("mssql");

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
            .query(
              `SELECT ddh.*, dc.DIACHI
            FROM DONDATHANG ddh
            JOIN (
                SELECT stt, MA_KHACH, CONCAT(SONHA_DUONG, ', ', p.TEN_PHUONG, ', ', tp.TEN_THANHPHO, ', ', tinh.TEN_TINH) AS diachi
                FROM DIACHIGIAOHANG dc
                JOIN PHUONG p ON p.MA_PHUONG = dc.PHUONG
                JOIN THANHPHO tp ON tp.MA_THANHPHO = dc.THANHPHO
                JOIN TINH tinh ON tinh.MA_TINH = dc.TINH
            ) AS dc ON ddh.STT_DIACHI = dc.stt AND ddh.MA_KHACH = dc.MA_KHACH;
            `
            )
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

  // [GET]
  GetSelectedOrderInfo(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input("MA_DONHANG", sql.VarChar(10), req.params.slug)
            .execute("dbo.SP_GET_ONE_ORDER_INFO")
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
    func().then((resReturn) => {
      res.json(resReturn.recordset);
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
            .input("MA_DONHANG", sql.VarChar(10), req.params.slug)
            .execute("dbo.SP_GET_ONE_ORDER_DETAIL")
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
      request.input("MA_DONHANG", sql.VarChar(10), req.params.slug);
      request.input("TRANGTHAI", sql.VarChar(10), req.params.slug1);

      request.execute("dbo.SP_UPDATE_ORDER_STATUS", function (err, response) {
        if (err) console.log(err);
        res?.json(response);
      });
    });
  }
}

module.exports = new ManageOrdersController();
