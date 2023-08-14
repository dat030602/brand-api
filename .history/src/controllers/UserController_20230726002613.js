const sql = require("mssql");

const execute = require("../lib/connectDb");
class UserController {
  async index(req, res) {}
  async Province(req, res) {
    console.log("AAAA");
    const resData = await execute.executeQuery("SELECT * FROM DBO.TINH");
    // console.log(resData);
    res.json(resData);
  }
  District(req, res) {
    // console.log("AAAA");
    async function getData() {
      const province = req.query.idtinh;
      const resData = await execute.executeQuery(
        `SELECT * FROM THANHPHO WHERE MA_TINH = ${province}`
      );
      console.log("res: ", sresData);
      res.json(resData);
    }
    getData();
  }
  Ward(req, res) {
    // console.log("AAAA");
    async function getData() {
      const city = req.query.idtp;
      const resData = await execute.executeQuery(
        `SELECT * FROM PHUONG WHERE MA_THANHPHO = ${city}`
      );
      // console.log(resData);
      res.json(resData);
    }
    getData();
  }

  async GetCartItem(req, res) {
    const id_user = req.query.id_user;
    const params = {
      name: "makhach",
      type: sql.VarChar(10),
      value: id_user,
    };
    const resData = await execute.executeProcedure("GetCartItem", params);
    console.log("SOS", resData);
    res.send(resData);
  }

  async UpdateCart(req, res) {}
}
module.exports = new UserController();
