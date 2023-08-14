const config = require("../DbConfig");
const sql = require("mssql");
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
      if (response.recordsets.length === 0) res.json({});
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
            .query(`select * from LOAISANPHAM`)
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
    sql.connect(config, function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("masp", sql.VarChar(10), req.body.data.id);
      request.input("tensp", sql.NVarChar(100), req.body.data.id);
      request.input("mota", sql.NCharVarChar(1000), req.body.data.name);
      request.input("brand", sql.NVarChar(30), req.body.data.name);
      // query to the database and get the records
      request.execute("dbo.SP_ADD_PRODUCT", function (err, response) {
        if (err) console.log(err);

        console.log(response);
        // send records as a response
        // res.send(recordset);
      });
      for (let index = 0; index < req.body.data.detail.length; index++) {
        const element = req.body.data.detail[index];
        request = new sql.Request();
        request.input("masp", sql.VarChar(10), element.id);
        request.input("tenctsp", sql.NVarChar(1000), element.name);
        request.input("giaban", sql.Float, element.stock);
        request.input("gianhap", sql.Float, element.image);
        request.input("slkho", sql.Int, element.image);
        request.input("hinhanh", sql.VarChar(5000), element.image);
        // query to the database and get the records
        request.execute("dbo.SP_ADD_DETAIL_PRODUCT", function (err, response) {
          if (err) console.log(err);

          // send records as a response
          res.json(response);
        });
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
      request.input("masp", sql.VarChar(10), req.body.data.masp);
      request.input("tenloaisp", sql.NVarChar(1000), req.body.data.tenloaisp);
      // query to the database and get the records
      request.execute(
        "dbo.SP_EDIT_PRODUCT_TEN_LOAI_SP",
        function (err, response) {
          if (err) console.log(err);
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
