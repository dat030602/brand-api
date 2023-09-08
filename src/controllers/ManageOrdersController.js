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
      request.input('TRANGTHAI', sql.VarChar(10), req.params.slug1);

      request.execute('dbo.SP_UPDATE_ORDER_STATUS', function (err, response) {
        if (err) console.log(err);
        res?.json(response);
      });
    });
  }

  GetOrderHistory(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .query(
              `select d.MA_KHACH, d.MA_DONHANG, d.TRANGTHAI, CONVERT(varchar, d.NGAYTAO, 107) as NGAYTAO, 
            d.LOAI_THANHTOAN, d.PHI_GIAO_HANG, d.TONGTIEN, d.GIAM_GIA,d.GIAM_GIA_GIAO_HANG, d.LY_DO_HUY, dc.SONHA_DUONG, p.TEN_PHUONG, tp.TEN_THANHPHO, 
            t.TEN_TINH
            from DONDATHANG d join DIACHIGIAOHANG dc on d.MA_KHACH = dc.MA_KHACH and d.STT_DIACHI = dc.STT
            join PHUONG p on dc.PHUONG = p.MA_PHUONG
            join THANHPHO tp on dc.THANHPHO = tp.MA_THANHPHO
            join TINH t on dc.TINH = t.MA_TINH
            where d.MA_KHACH like '%${req.query.id}%';
            select d.MA_DONHANG, ct.MA_SP, ct.STT, sp.TEN_SP, ctsp.TEN_CTSP, ctsp.GIA_BAN, ct.SOLUONG, h.HINHANH
            from DONDATHANG d join CT_DONDATHANG ct on d.MA_DONHANG = ct.MA_DONHANG
            join SANPHAM sp on ct.MA_SP = sp.MA_SP
            join CT_SANPHAM ctsp on ct.MA_SP = ctsp.MA_SP and ct.STT = ctsp.STT
            join HINHANHSP h on ct.MA_SP = h.MA_SP and ct.STT = h.STT
            where d.MA_KHACH like '%${req.query.id}%'`,
            )
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
      if (response?.recordsets === undefined) res.status(400);
      else if (response.recordsets.length === 0) res.status(400);
      else
        res.json(
          response.recordsets[0].map((el) => {
            return {
              voucher: el,
              history: response.recordsets[1].filter((el1) => {
                return el.MA_DONHANG === el1.MA_DONHANG;
              }),
            };
          }),
        );
    });
  }
}

module.exports = new ManageOrdersController();
