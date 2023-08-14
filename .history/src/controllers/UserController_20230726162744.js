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

  async CheckOut(req, res) {
    const id_user = req.body.id_user;
    const dataCheckOut = req.body.dataCheckOut;
  }
  async Address(req, res) {
    const id_user = req.query.id_user;
    const resData = await execute.executeQuery(
      "SELECT SONHA_DUONG,TEN_TINH,TEN_THANHPHO,TEN_PHUONG FROM DIACHIGIAOHANG DC JOIN TINH T ON DC.TINH = T.MA_TINH JOIN THANHPHO TP ON DC.THANHPHO = TP.MA_THANHPHO JOIN PHUONG P ON DC.PHUONG = P.MA_PHUONG"
    );
    res.send(resData);
  }
}
module.exports = new UserController();
