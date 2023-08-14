const sql = require("mssql");
const axios = require("axios");
var fetch = require("node-fetch");

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
      `SELECT STT,SONHA_DUONG,TEN_TINH,TEN_THANHPHO,TEN_PHUONG,MAC_DINH FROM DIACHIGIAOHANG DC JOIN TINH T ON DC.TINH = T.MA_TINH JOIN THANHPHO TP ON DC.THANHPHO = TP.MA_THANHPHO JOIN PHUONG P ON DC.PHUONG = P.MA_PHUONG WHERE MA_KHACH = '${id_user}'`
    );
    const address = [];
    resData[0].map((addressTemp) => {
      const temp = {
        stt: addressTemp.STT,
        SONHA_DUONG: addressTemp.SONHA_DUONG,
        TEN_PHUONG: addressTemp.TEN_PHUONG,
        TEN_THANHPHO: addressTemp.TEN_THANHPHO,
        TEN_TINH: addressTemp.TEN_TINH,
        MAC_DINH: addressTemp.MAC_DINH,
        // fullInfo: `${address.SONHA_DUONG}, ${address.TEN_PHUONG}, ${address.TEN_THANHPHO}, ${address.TEN_TINH}`,
      };
      address.push(temp);
    });
    res.send(address);
  }

  async Payment(req, res) {
    const id_user = req.body.username;
    const data = req.body.data;
    const link = `${process.env.PAYPAL_LINK}/v2/checkout/orders/`;
    await getToken().then((res) => {
      const token = res.data.access_token;
      fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "/applicationjson",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            { amount: { currency_code: "USD", value: "100.00" } },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                payment_method_selected: "PAYPAL",
                brand_name: "EXAMPLE INC",
                locale: "en-US",
                landing_page: "LOGIN",
                shipping_preference: "SET_PROVIDED_ADDRESS",
                user_action: "PAY_NOW",
                return_url: "https://example.com/returnUrl",
                cancel_url: "https://example.com/cancelUrl",
              },
            },
          },
        }),
      });
    });
  }

  async GetFeeShip(req, res) {
    const id_user = req.query.id_user;
    const stt = req.query.stt;
    const resData = await execute.executeQuery(
      `SELECT TINH,THANHPHO,PHUONG FROM DIACHIGIAOHANG WHERE MA_KHACH = '${id_user}' AND STT = '${stt}'`
    );
    // res.send(resData);
    // console.log(resData[0][0].THANHPHO);
    const id_district = resData[0][0].THANHPHO;
    const id_ward = resData[0][0].PHUONG;
    GetServiceShip(1452, id_district).then((id_service) => {
      GetFeeAndDate(id_service, 1452, "21014", id_district, id_ward).then(
        (feeShip) => {
          feeShip = (feeShip / 23745).toFixed(2);
          res.send({ message: feeShip });
        }
      );
    });
    // console.log(id_service);
  }
}

const getToken = async () => {
  const baseUrl = `${process.env.PAYPAL_LINK}/v1/oauth2/token`;
  const userName = process.env.PAYPAL_USERNAME;
  const password = process.env.PAYPAL_PASSWORD;
  return await axios.request({
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // url: "/oauth2/token",
    method: "post",
    baseURL: baseUrl,
    data: "grant_type=client_credentials",
    auth: {
      username: userName,
      password: password,
    },
  });
};

const GetServiceShip = (from_district, to_district) => {
  const shopid = process.env.GHN_SHOPID;
  const linkGHN = process.env.GHN_LINK;
  const token = process.env.GHN_TOKEN;
  const baseUrl = `${linkGHN}/available-services?shop_id=${shopid}&from_district=${from_district}&to_district=${to_district}`;
  console.log("to: ", to_district);
  return axios
    .get(baseUrl, {
      headers: {
        token: token,
      },
    })
    .then((result) => {
      // console.log(result.data);
      return result.data.data[0].service_id;
    })
    .catch((error) => {
      console.log(error);
    });
};

const GetFeeAndDate = (
  service_id,
  from_district,
  from_ward,
  to_district,
  to_ward
) => {
  const shopid = process.env.GHN_SHOPID;
  const linkGHN = process.env.GHN_LINK;
  const token = process.env.GHN_TOKEN;
  const baseUrl = `${linkGHN}/fee`;
  let data = JSON.stringify({
    from_district_id: from_district,
    from_ward: from_ward,
    service_id: service_id,
    service_type_id: null,
    to_district_id: to_district,
    to_ward_code: to_ward,
    height: 5,
    length: 20,
    weight: 100,
    width: 12,
    cod_failed_amount: 0,
    insurance_value: 0,
    coupon: null,
  });
  return axios
    .post(baseUrl, data, {
      headers: {
        token: token,
        ShopId: shopid,
        "Content-Type": "application/json",
      },
    })
    .then((result) => result.data.data.total)
    .catch((error) => {
      console.log(error);
    });
};

module.exports = new UserController();
