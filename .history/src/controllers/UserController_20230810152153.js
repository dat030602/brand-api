const sql = require("mssql");
const axios = require("axios");
var fetch = require("node-fetch");
const config = require("../DbConfig");

const { link } = require("../routes/User");
class UserController {
  async index(req, res) {}
  async Province(req, res) {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().query("SELECT * FROM TINH");
      res.send({ message: "success", data: result.recordset });
    } catch (err) {
      res.send({ message: "error" });
    }
  }
  async District(req, res) {
    try {
      const province = req.query.id_province;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("MA_TINH", sql.Int, province)
        .query("SELECT * FROM THANHPHO WHERE MA_TINH = @MA_TINH");
      res.send({ message: "success", data: result.recordset });
    } catch (err) {
      res.send({ message: "error" });
    }
  }
  async Ward(req, res) {
    try {
      const district = req.query.id_district;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("MA_THANHPHO", sql.Int, district)
        .query("SELECT * FROM PHUONG WHERE MA_THANHPHO = @MA_THANHPHO");
      res.send({ message: "success", data: result.recordset });
    } catch (err) {
      res.send({ message: "error" });
    }
  }

  async GetCartItem(req, res) {
    try {
      const id_user = req.query.id_user;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("MAKHACH", sql.VarChar(10), id_user)
        .execute("GetCartItem");
      res.send({ message: "success", data: result.recordset });
    } catch (err) {
      res.send({ message: "error" });
    }
  }

  async ChangeItemCartAmount(req, ses) {
    try {
      const id_user = req.body.id_user;
      const id_product = req.body.id_product;
      const index = req.body.index;
      const amount = req.body.amountChange;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("MAKHACH", sql.VarChar(10), id_user)
        .input("MASP", sql.VarChar(10), id_product)
        .input("STT", sql.Int, index)
        .input("SOLUONG", sql.Int, amount)
        .execute("KH_UPDATE_CT_GIOHANG");
      res.send({ message: "success", data: result.recordset });
    } catch (err) {
      res.send({ message: "error" });
    }
  }

  async CheckOut(req, res) {
    const id_user = req.body.id_user;
    const dataCheckOut = req.body.dataCheckOut;
  }
  async Address(req, res) {
    try {
      const id_user = req.query.id_user;
      let pool = await sql.connect(config);

      let result = await pool
        .request()
        .input("USERNAME", sql.VarChar(10), id_user)
        .execute("ADDRESS_USER");

      const address = [];
      const dataTemp = result.recordset;
      dataTemp.map((addressTemp) => {
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
      res.send({ message: "success", data: address });
    } catch (error) {
      console.log("eroor: AAAAA");
      res.send({ message: "error" });
    }
  }

  // async Payment(req, res) {
  //   const id_user = req.body.username;
  //   const data = req.body.data;
  //   const link = `${process.env.PAYPAL_LINK}/v2/checkout/orders/`;
  //   await getToken().then((res) => {
  //     const token = res.data.access_token;
  //     fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "/applicationjson",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         intent: "CAPTURE",
  //         purchase_units: [
  //           { amount: { currency_code: "USD", value: "100.00" } },
  //         ],
  //         payment_source: {
  //           paypal: {
  //             experience_context: {
  //               payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
  //               payment_method_selected: "PAYPAL",
  //               brand_name: "EXAMPLE INC",
  //               locale: "en-US",
  //               landing_page: "LOGIN",
  //               shipping_preference: "SET_PROVIDED_ADDRESS",
  //               user_action: "PAY_NOW",
  //               return_url: "https://example.com/returnUrl",
  //               cancel_url: "https://example.com/cancelUrl",
  //             },
  //           },
  //         },
  //       }),
  //     });
  //   });
  // }

  async GetShipData(req, res) {
    try {
      const id_user = req.query.id_user;
      const stt = req.query.index;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("MA_KHACH", sql.VarChar(10), id_user)
        .input("STT", sql.Int, stt)
        .query(
          "SELECT TINH,THANHPHO,PHUONG FROM DIACHIGIAOHANG WHERE MA_KHACH = @MA_KHACH AND STT = @STT"
        );
      const tempData = result.recordset;
      console.log(tempData);
      const id_district = tempData[0].THANHPHO;
      const id_ward = tempData[0].PHUONG;
      const id_service = await GetServiceShip(1452, id_district);
      let fee = await GetFee(id_service, 1452, "21014", id_district, id_ward);
      fee = Number((fee / 23750).toFixed(2));
      const secs = await GetDate(
        id_service,
        1452,
        "21014",
        id_district,
        id_ward
      );
      const now = new Date().getTime() / 1000;

      const dayShip = Math.ceil((secs - now + 7 * 3600) / 86400);
      res.send({
        message: "success",
        data: {
          id_service,
          fee,
          dayShip,
        },
      });
    } catch (error) {
      res.send(error);
    }
  }
}

const getToken = async () => {
  const baseUrl = `${process.env.PAYPAL_LINK}/v1/oauth2/token`;
  const userName = process.env.PAYPAL_USERNAME;
  const password = process.env.PAYPAL_PASSWORD;
  return await axios.request({
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "post",
    baseURL: baseUrl,
    data: "grant_type=client_credentials",
    auth: {
      username: userName,
      password: password,
    },
  });
};

const GetServiceShip = async (from_district, to_district) => {
  const shopid = process.env.GHN_SHOPID;
  const linkGHN = process.env.GHN_LINK;
  const token = process.env.GHN_TOKEN;
  const baseUrl = `${linkGHN}/available-services?shop_id=${shopid}&from_district=${from_district}&to_district=${to_district}`;

  const response = await axios.get(baseUrl, {
    headers: {
      token: token,
    },
  });

  const dataServices = response.data.data;
  const serviceChoose = dataServices.find(
    (service) => service.short_name === "Chuyển phát thương mại điện tử"
  );
  return serviceChoose.service_id;
};

const GetFee = async (
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

  const response = await axios.post(baseUrl, data, {
    headers: {
      token: token,
      ShopId: shopid,
      "Content-Type": "application/json",
    },
  });
  const feeData = response.data.data;
  return feeData.total;
  // const dataJson = await response.json();
  // return dataJson;
  // return axios
  //   .post(baseUrl, data, {
  //     headers: {
  //       token: token,
  //       ShopId: shopid,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   .then((result) => result.data.data.total)
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

const GetDate = async (
  service_id,
  from_district,
  from_ward,
  to_district,
  to_ward
) => {
  const shopid = process.env.GHN_SHOPID;
  const linkGHN = process.env.GHN_LINK;
  const token = process.env.GHN_TOKEN;
  const baseUrl = `${linkGHN}/leadtime`;
  let data = JSON.stringify({
    from_district_id: from_district,
    from_ward_code: from_ward,
    service_id: service_id,
    to_district_id: to_district,
    to_ward_code: to_ward,
  });

  const response = await axios.post(baseUrl, data, {
    headers: {
      token: token,
      ShopId: shopid,
      "Content-Type": "application/json",
    },
  });
  const dateData = response.data.data;
  return dateData.leadtime;
};

module.exports = new UserController();
