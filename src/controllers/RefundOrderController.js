require('../FirebaseConfig');
const firebase = require('firebase/storage');
const uuid = require('uuid');
const config = require('../DbConfig');
const sql = require('mssql');

const storage = firebase.getStorage();

class RefundOrderController {
  async index(req, res) {}
  // [POST]
  async AddNewRefundRequest(req, res) {
    const body = JSON.parse(req.body.data);
    async function UploadImage(file) {
      try {
        const storageRef = firebase.ref(
          storage,
          `Image/${file.originalname.slice(0, file.originalname.length - 4) + uuid.v4()}`,
        );
        const metadata = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        const snapshot = await firebase.uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await firebase.getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        return '';
      }
    }

    try {
      var maht = 'HT' + Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
      var result;
      const downloadURL = await UploadImage(req.files['imageUpload'][index]);
      await sql.connect(config).then((conn) =>
        conn
          .request()
          .input('maht', sql.VarChar(10), maht)
          .input('maddh', sql.VarChar(10), ref.body.maddh)
          .input('makhach', sql.VarChar(10), ref.body.makhach)
          .input(`hinhanh`, sql.VarChar(5000), downloadURL)
          .input('lydo', sql.NVarChar(4000), ref.body.lydo)
          .input('note', sql.NVarChar(4000), ref.body.note)
          // query to the database and get the records
          .execute('dbo.SP_ADD_REFUND_REQUEST')
          .then((v) => {
            result = v;
          })
          .then(() => conn.close()),
      );
      if (result.returnValue === 1) {
        for (let index = 0; index < body.detail.length; index++) {
          const element = body.detail[index];
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

  AddRefundDetail(req, res) {
    const body = JSON.parse(req.body.data);
    sql.connect(config, async function (err) {
      if (err) console.log(err);
      try {
        var requestDetail = new sql.Request();
        requestDetail.input(`maht`, sql.VarChar(10), body.MAHT);
        requestDetail.input(`masp`, sql.VarChar(10), body.MA_SP);
        requestDetail.input(`stt`, sql.Int, body.STT);
        requestDetail.input(`soluong`, sql.Int, body.SOLUONG);
        requestDetail.input(`gia`, sql.Float, body.GIA);

        // query to the database and get the records
        requestDetail.execute('dbo.SP_ADD_CT_HOANTRA', function (err, response) {
          if (err) {
            console.log(err);
            res.json({ returnValue: 0 });
          } else {
            res.json({ returnValue: 1 });
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}
module.exports = new RefundOrderController();
