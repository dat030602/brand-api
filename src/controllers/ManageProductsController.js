require("../FirebaseConfig");
const firebase = require("firebase/storage");
const uuid = require("uuid");
const config = require("../DbConfig");
const sql = require("mssql");

const storage = firebase.getStorage();

class ManageProductsController {
  async index(req, res) {}
  // [GET]
  GetProducts(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .query(
              `select * from V_SANPHAM;select * from V_CT_SANPHAM;select * from V_HINHANH_SANPHAM`
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
      if (response.recordsets === undefined) res.json({});
      else if (response.recordsets.length === 0) res.json({});
      else
        res.json(
          response.recordsets[0].map((el) => {
            return {
              product: el,
              detail: response.recordsets[1].filter((el1) => {
                return el.MA_SP === el1.MA_SP;
              }),
              image: response.recordsets[2].filter((el2) => {
                return el.MA_SP === el2.MA_SP;
              }),
            };
          })
        );
    });
  }
  // [GET] /type-product
  GetTypeProduct(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .query(`SELECT * FROM dbo.LOAISANPHAM`)
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

  // [POST]
  AddProduct(req, res) {
    const body = JSON.parse(req.body.data);
    async function UploadImage(file) {
      try {
        const storageRef = firebase.ref(
          storage,
          `Image/${
            file.originalname.slice(0, file.originalname.length - 4) + uuid.v4()
          }`
        );
        const metadata = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        const snapshot = await firebase.uploadBytesResumable(
          storageRef,
          file.buffer,
          metadata
        );
        const downloadURL = await firebase.getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        return "";
      }
    }

    async function AddDetail(element, index, id) {
      try {
        var requestDetail = new sql.Request();
        const downloadURL = await UploadImage(req.files["imageUpload"][index]);
        requestDetail.input(`masp`, sql.VarChar(10), id);
        requestDetail.input(`stt`, sql.Int, index + 1);
        requestDetail.input(`tenctsp`, sql.NVarChar(1000), element.name);
        requestDetail.input(`giaban`, sql.Float, element.price);
        requestDetail.input(`gianhap`, sql.Float, element.importPrice);
        requestDetail.input(`slkho`, sql.Int, element.stock);
        requestDetail.input(`hinhanh`, sql.VarChar(5000), downloadURL);
        // query to the database and get the records
        requestDetail.execute(
          "dbo.SP_ADD_DETAIL_PRODUCT",
          function (err, response) {
            if (err) {
              console.log(err);
              res.json({ returnValue: 0 });
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
    sql.connect(config, function (err) {
      if (err) console.log(err);

      let id = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 10) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), id);
      request.input("tensp", sql.NVarChar(100), body.product.name);
      request.input("mota", sql.NVarChar(1000), body.product.description);
      request.input("brand", sql.NVarChar(30), body.product.brand);
      request.input("tenloaisp", sql.NVarChar(1000), body.product.category);
      // query to the database and get the records
      request.execute("dbo.SP_ADD_PRODUCT", function (err, response) {
        if (err) console.log(err);
        else {
          for (let index = 0; index < body.detail.length; index++) {
            const element = body.detail[index];
            AddDetail(element, index, id);
          }
          res.json({ returnValue: 1 });
        }
      });
    });
  }
  // [POST]
  AddDetailProduct(req, res) {
    const body = JSON.parse(req.body.data);

    async function UploadImage(file) {
      try {
        const storageRef = firebase.ref(
          storage,
          `Image/${
            file.originalname.slice(0, file.originalname.length - 4) + uuid.v4()
          }`
        );
        const metadata = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        const snapshot = await firebase.uploadBytesResumable(
          storageRef,
          file.buffer,
          metadata
        );
        const downloadURL = await firebase.getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        return "";
      }
    }
    sql.connect(config, async function (err) {
      if (err) console.log(err);
      try {
        var requestDetail = new sql.Request();
        const downloadURL = await UploadImage(req.files["imageUpload"][0]);
        requestDetail.input(`masp`, sql.VarChar(10), body.masp);
        requestDetail.input(`stt`, sql.Int, body.stt);
        requestDetail.input(`tenctsp`, sql.NVarChar(1000), body.name);
        requestDetail.input(`giaban`, sql.Float, body.price);
        requestDetail.input(`gianhap`, sql.Float, body.importPrice);
        requestDetail.input(`slkho`, sql.Int, body.stock);
        requestDetail.input(`hinhanh`, sql.VarChar(5000), downloadURL);
        // query to the database and get the records
        requestDetail.execute(
          "dbo.SP_ADD_DETAIL_PRODUCT",
          function (err, response) {
            if (err) {
              console.log(err);
              res.json({ returnValue: 0 });
            } else {
              res.json({ returnValue: 1 });
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }
  // [PUT] /edit/ten-san-pham
  EditProduct_TEN_SP(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("tensp", sql.NVarChar(100), req.body.data.tensp);
      // query to the database and get the records
      request.execute("dbo.SP_EDIT_PRODUCT_TEN_SP", function (err, response) {
        if (err) console.log(err);
        res?.json(response);
      });
    });
  }
  // [PUT] /edit/ten-loai-san-pham
  EditProduct_TEN_LOAI_SP(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      console.log(req.body.data);
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("tenloaisp", sql.NVarChar(1000), req.body.data.tenloaisp);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_PRODUCT_TEN_LOAI_SP",
        function (err, response) {
          if (err) console.log(err);
          console.log(response.returnValue);
          res.json(response);
        }
      );
    });
  }
  // [PUT] /edit/mo-ta
  EditProduct_MO_TA(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("mota", sql.NVarChar(1000), req.body.data.mota);
      // query to the database and get the records
      request.execute("dbo.SP_EDIT_PRODUCT_MO_TA", function (err, response) {
        if (err) console.log(err);
        res.json(response);
      });
    });
  }
  // [PUT] /edit/brand
  EditProduct_BRAND(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("brand", sql.VarChar(30), req.body.data.brand);
      // query to the database and get the records
      request.execute("dbo.SP_EDIT_PRODUCT_BRAND", function (err, response) {
        if (err) console.log(err);
        res.json(response);
      });
    });
  }
  // [PUT] /edit/ten-chi-tiet-san-pham
  EditDetailProduct_TEN_CTSP(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("stt", sql.Int, req.body.data.stt);
      request.input("tenctsp", sql.NVarChar(1000), req.body.data.tenctsp);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_DETAIL_PRODUCT_TEN_CTSP",
        function (err, response) {
          if (err) console.log(err);
          res.json(response);
        }
      );
    });
  }
  // [PUT] /edit/gia-ban
  EditDetailProduct_GIA_BAN(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("stt", sql.Int, req.body.data.stt);
      request.input("giaban", sql.Float, req.body.data.giaban);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_DETAIL_PRODUCT_GIA_BAN",
        function (err, response) {
          if (err) console.log(err);
          res.json(response);
        }
      );
    });
  }
  // [PUT] /edit/gia-nhap
  EditDetailProduct_GIA_NHAP(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("stt", sql.Int, req.body.data.stt);
      request.input("gianhap", sql.Float, req.body.data.gianhap);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_DETAIL_PRODUCT_GIA_NHAP",
        function (err, response) {
          if (err) console.log(err);
          res.json(response);
        }
      );
    });
  }
  // [PUT] /edit/so-luong-kho
  EditDetailProduct_SL_KHO(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("stt", sql.Int, req.body.data.stt);
      request.input("slkho", sql.Int, req.body.data.slkho);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_DETAIL_PRODUCT_SL_KHO",
        function (err, response) {
          if (err) console.log(err);
          res.json(response);
        }
      );
    });
  }
  // [PUT] /edit/hinh-anh
  EditDetailProduct_HINHANHSP(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("stt", sql.Int, req.body.data.stt);
      request.input("hinhanh", sql.VarChar(5000), req.body.data.hinhanh);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_DETAIL_PRODUCT_HINHANHSP",
        function (err, response) {
          if (err) console.log(err);
          res.json(response);
        }
      );
    });
  }
  // [DELETE]
  DeleteProduct(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input("masp", sql.VarChar(10), req.body.masp)
            .execute("dbo.SP_DELETE_PRODUCT")
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
      res.json(response);
    });
  }
  // [DELETE] /delete-detail
  DeleteDetailProduct(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input("masp", sql.VarChar(10), req.body.masp)
            .input("stt", sql.Int, req.body.stt)
            .execute("dbo.SP_DELETE_DETAIL_PRODUCT")
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
      res.json(response);
    });
  }
}

module.exports = new ManageProductsController();
