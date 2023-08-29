const config = require('../DbConfig');
const sql = require('mssql');

class LoyaltyController {
  async index(req, res) {}
  // [GET]
  GetRewardPoint(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input('makh', sql.VarChar(10), req.query.username)
            .execute('dbo.SP_GET_REWARDPOINT')
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
}
module.exports = new LoyaltyController();
