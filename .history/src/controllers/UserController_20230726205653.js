const sql = require("mssql");
const axios = require("axios");

const execute = require("../lib/connectDb");
const { link } = require("../routes/User");
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
      `SELECT STT,SONHA_DUONG,TEN_TINH,TEN_THANHPHO,TEN_PHUONG FROM DIACHIGIAOHANG DC JOIN TINH T ON DC.TINH = T.MA_TINH JOIN THANHPHO TP ON DC.THANHPHO = TP.MA_THANHPHO JOIN PHUONG P ON DC.PHUONG = P.MA_PHUONG WHERE MA_KHACH = '${id_user}'`
    );
    const adressData = [];
    resData[0].map((address) => {
      const temp = {
        stt: address.STT,
        fullInfo: `${address.SONHA_DUONG}, ${address.TEN_PHUONG}, ${address.TEN_THANHPHO}, ${address.TEN_TINH}`,
      };
      adressData.push(temp);
    });
    res.send(adressData);
  }
  async GetFeeShip(req, res) {
    const id_user = req.query.id_user;
    const stt = req.query.stt;
    const resData = await execute.executeQuery(
      `SELECT TINH,THANHPHO,PHUONG FROM DIACHIGIAOHANG WHERE MA_KHACH = '${id_user}' AND STT = '${stt}'`
    );
    // res.send(resData);
    console.log(resData[0]);
    // const id_district = resData[0].THANHPHO;
    // const id_service = await GetServiceShip(1452, id_district);
  }
}

const GetServiceShip = async (from_district, to_district) => {
  const shopid = process.env.SHOPID_GHN;
  const linkGHN = process.env.LINK_GHN;
  const token = process.env.TOKEN_GHN;
  const baseUrl = `${linkGHN}/available-services?shop_id=${shopid}&from_district=${from_district}&to_district=${to_district}`;
  let config = {
    headers: {
      token: token,
    },
  };
  await axios
    .get(baseUrl, {
      headers: {
        token: token,
      },
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = new UserController();
