const config = require('../DbConfig');
const sql = require('mssql');
class HomeController {
  async index(req, res) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      var request = new sql.Request();
      // query to the database and get the records
      request.execute('dbo.SP_GET_PRODUCTS_RECOMMEND', function (err, response) {
        if (err) res.json(err);
        else {
          var size = response.recordsets[0].length;
          res.json({
            recommend: size > 5 ? response.recordsets[0].slice(0, size - (size % 5)) : response.recordsets[0],
            type_product: response.recordsets[1],
            deal: {
              time: response.recordsets[2][0].end_date,
              product: response.recordsets[2].map((el) => {
                return {
                  ma_sp: el.ma_sp,
                  ten_sp: el.ten_sp,
                  discount: el.discount,
                  hinhanh: el.hinhanh,
                };
              }),
            },
          });
        }
      });
    });
  }
}

module.exports = new HomeController();
