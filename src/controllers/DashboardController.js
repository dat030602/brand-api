const config = require('../DbConfig');
const sql = require('mssql');
const sign = require('jwt-encode');

class AuthenticationController {
  async index(req, res) {}
  // [GET] /
  GetData(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
						.input("date", sql.DateTime, req.query.date)
            .execute('dbo.SP_Get_DashBoard')
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
      if (response?.recordsets.length !== 0){
        res.json({
          countCustomers: response?.recordsets[0][0].count,
          countProducts: response?.recordsets[1][0].count,
          countOrders: response?.recordsets[2][0].count,
          countVouchers: response?.recordsets[3][0].count,
          countCustomersYoung: response?.recordsets[4][0].count,
          countCustomersOld: response?.recordsets[5][0].count,
          listCustomers: response?.recordsets[6],
        })
      }
      else res.json(response?.recordsets);
    });
  }
  // [GET] /statistic
  GetData_Statistics_Month(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
						.input("date", sql.DateTime, req.query.date)
            .execute('dbo.SP_Get_Statistics_DashBoard_Month')
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
  GetData_Statistics_All(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .execute('dbo.SP_Get_Statistics_DashBoard_All')
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
  GetData_Statistics_Year(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
						.input("date", sql.DateTime, req.query.date)
            .execute('dbo.SP_Get_Statistics_DashBoard_Year')
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

module.exports = new AuthenticationController();
