const firebase = require('firebase/storage');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const uuid = require('uuid');
const config = require('../DbConfig');
const sql = require('mssql');

class RefundOrderController {
  async index(req, res) {}

  // [POST]
  async AddNewRefundRequest(req, res) {
    const body = JSON.parse(req.body.data);

    async function UploadImage(file) {
      try {
        if (!file) {
          return '';
        }

        const storageRef = ref(
          getStorage(),
          `Image/${file.originalname.slice(0, file.originalname.length - 4) + uuid.v4()}`,
        );
        const metadata = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        return 'error';
      }
    }

    try {
      const maht = 'HT' + Math.floor(Math.random() * 9000000 + 1000000);

      let result;

      const imageFile = req.files['imageUpload'] && req.files['imageUpload'][0];
      const downloadURL = await UploadImage(imageFile || '');

      // console.log('hi', downloadURL);
      console.log(body);

      await sql.connect(config).then((conn) =>
        conn
          .request()
          .input('maht', sql.VarChar(10), maht)
          .input('maddh', sql.VarChar(10), body.maddh)
          .input('makhach', sql.VarChar(10), body.makhach)
          .input(`hinhanh`, sql.VarChar(5000), downloadURL)
          .input('lydo', sql.NVarChar(4000), body.lydo)
          .input('note', sql.NVarChar(4000), body.note)
          // .input('sotien', sql.Float, body.sotien)

          // query to the database and get the records
          .execute('dbo.SP_ADD_REFUND_REQUEST')
          .then((v) => {
            result = v;
          })
          .then(() => conn.close()),
      );
      if (result.returnValue === 1) {
        for (let index = 0; index < body.items.length; index++) {
          const element = body.items[index];
          await sql.connect(config).then((conn) =>
            conn
              .request()
              .input(`maht`, sql.VarChar(10), maht)
              .input(`masp`, sql.VarChar(10), element.MA_SP)
              .input(`stt`, sql.Int, element.STT)
              .input(`soluong`, sql.Int, element.SOLUONG)
              .input(`gia`, sql.Float, element.GIA)

              // query to the database and get the records
              .execute('dbo.SP_ADD_CT_HOANTRA')
              .then((v) => {
                result = v;
              })
              .then(() => conn.close()),
          );
        }
        res.json({ returnValue: 1 });
      }
    } catch (err) {
      res.json(err);
      return;
    }
  }
  // [PUT]
  CancelRefund(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      console.log('ho', req.body.data);

      // create Request object
      var request = new sql.Request();
      request.input('MA_HOANTRA', sql.VarChar(10), req.body.data.refundID);
      request.input('MA_DONHANG', sql.VarChar(10), req.body.data.orderID);

      request.execute('dbo.SP_KH_CANCEL_REFUND', function (err, response) {
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
}
module.exports = new RefundOrderController();
