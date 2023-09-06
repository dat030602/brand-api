const sql = require("mssql");
const axios = require("axios");
var fetch = require("node-fetch");
const config = require("../DbConfig");
// const CheckItemOrder = require("../middleware/CheckItem");

const { link, head } = require("../routes/User");
const { async } = require("@firebase/util");
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

  async ChangeItemCartAmount(req, res) {
    try {
      const id_user = req.body.data.id_user;
      const id_product = req.body.data.id_product;
      const index = req.body.data.index;
      const amount = req.body.data.amount;
      if (amount > 0) {
        let pool = await sql.connect(config);
        let result = await pool
          .request()
          .input("MA_KHACH", sql.VarChar(10), id_user)
          .input("MA_SP", sql.VarChar(10), id_product)
          .input("STT", sql.Int, index)
          .input("SO_LUONG", sql.Int, amount)
          .execute("CHANGE_ITEM_CART_AMOUNT");
        res.send({ message: "success" });
      } else {
        let pool = await sql.connect(config);
        let result = await pool
          .request()
          .input("MA_KHACH", sql.VarChar(10), id_user)
          .input("MA_SP", sql.VarChar(10), id_product)
          .input("STT", sql.Int, index)
          .execute("REMOVE_ITEM_CART");
        res.send({ message: "success" });
      }
    } catch (err) {
      res.send({ message: "error" });
    }
  }

  async Address(req, res) {
    try {
      const id_user = req.query.id_user;
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("USERNAME", sql.VarChar(10), id_user)
        .execute("ADDRESS_USER");
      let result3 = await pool
        .request()
        .input("MA_KHACH", sql.VarChar(10), id_user)
        .execute("GET_VOUCHER");
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
          FULL_INFO: `${addressTemp.SONHA_DUONG}, ${addressTemp.TEN_PHUONG}, ${addressTemp.TEN_THANHPHO}, ${addressTemp.TEN_TINH}`,
        };
        address.push(temp);
      });
      res.send({
        message: "success",
        data: { address, voucher: result3.recordset },
      });
    } catch (error) {
      res.send({ message: "error" });
    }
  }

  async Payment(req, res) {
    try {
      const data = req.body.data;
      const dataUser = data.data_User;
      const listOrderItem = data.list_Item_Order;
      const dateUtc = new Date();
      const utcSec = dateUtc.getTime();
      const dateCreate = new Date(utcSec + 3600000 * 7);
      let pool = await sql.connect(config);
      let get_MA_GH = await pool
        .request()
        .input("MA_KHACH", sql.VarChar(10), dataUser.id_user)
        .query("select MA_GH from GIOHANG WHERE MA_KHACH = @MA_KHACH");
      let err = false;
      let discount = 0;
      if (dataUser.shipping_discount_id != null) {
        let get_voucher = await pool
          .request()
          .input("MA_KHACH", sql.VarChar(10), dataUser.id_user)
          .input("ID_VOUCHER", sql.VarChar(10), dataUser.shipping_discount_id)
          .execute("GET_VOUCHER_USER");
        if (get_voucher.recordset.length === 0) err = true;
        else discount = get_voucher.recordset[0].discount;
      }
      if (err === true) res.sendStatus(404);
      else {
        const MA_GH = get_MA_GH.recordset[0].MA_GH;
        const check = await CheckItemOrder(listOrderItem, MA_GH);
        if (check === 0) res.sendstatus(404);
        else {
          if (dataUser.payment_method === "paypal") {
            const access_token = await getToken();
            const info = await GetAllInfo(
              listOrderItem,
              dataUser.id_user,
              dataUser.index_address,
              discount
            );

            const dataFormPayment = await CreatePaymentForm(
              listOrderItem,
              info
            );
            const responeDataFromPayPal = await CreateOrderPayPal(
              access_token,
              dataFormPayment
            );
            if (responeDataFromPayPal.status === "fail") res.sendstatus(404);
            else {
              let create_DH = await pool
                .request()
                .input("MA_DONHANG", sql.VarChar(10), info.MA_DH)
                .input("MA_KHACH", sql.VarChar(10), dataUser.id_user)
                .input("NGAY_TAO", sql.DateTime, dateCreate)
                .input("STT_DIACHI", sql.Int, dataUser.index_address)
                .input("TONGTIEN", sql.Float, info.total)
                .input("PHI_GIAO_HANG", sql.Float, info.ship_fee)
                .input(
                  "LOAI_THANHTOAN",
                  sql.VarChar(10),
                  dataUser.payment_method
                )
                .input("THUE", sql.Float, 0)
                .input("GIAM_GIA", sql.Float, info.discount)
                .input("GIAM_GIA_GIAO_HANG", sql.Float, info.ship_discount)
                .input("LY_DO_HUY", sql.NVarChar(1000), null)
                .input("NGAY_GIAO_HANG", sql.VarChar(1000), info.dateShip)
                .input("PAYPAL_ID", sql.VarChar(1000), responeDataFromPayPal.id)
                .execute("CREATE_ORDER");
              if (create_DH.returnValue === 1) {
                const wait = listOrderItem.map(async (product) => {
                  let insertProduct = await pool
                    .request()
                    .input("MA_DONHANG", sql.VarChar(10), info.MA_DH)
                    .input("MA_SP", sql.VarChar(10), product.MA_SP)
                    .input("STT", sql.Int, product.STT)
                    .input("SL", sql.Int, product.SL)
                    .input("MA_GH", sql.Int, MA_GH)
                    .execute("INSERT_ITEM_ORDER");
                });
                Promise.all(wait).then(() => {
                  res.send({
                    status: "success",
                    linkPayment: responeDataFromPayPal.linkCheckOut,
                  });
                });
              } else {
                res.sendstatus(404);
              }
            }
          }
        }
      }
    } catch (err) {
      res.send(err);
    }
  }

  async ConfirmPaypal(req, res) {
    const bodyData = req.body.data;
    const id_Paypal = bodyData.id_Paypal;
    const id_user = bodyData.id_user;
    const dateUtc = new Date();
    const utcSec = dateUtc.getTime();
    const dateUpdate = new Date(utcSec + 3600000 * 7);
    let pool = await sql.connect(config);
    let check_user = await pool
      .request()
      .input("MA_KHACH", sql.VarChar(10), id_user)
      .input("ID_PAYPAL", sql.VarChar(1000), id_Paypal)
      .execute("CHECK_PAYPAL_PAYMENT");
    if (check_user.recordset.length != 0) {
      const access_token = await getToken();
      const checkData = await CheckOrderPaypal(access_token, id_Paypal);
      if (checkData.status === "APPROVED") {
        const statusConfirm = await ConfirmPaypal(access_token, id_Paypal);
        if (statusConfirm.status === "COMPLETED") {
          let pool2 = await sql.connect(config);
          let confirmPaypal = await pool2
            .request()
            .input("MA_KHACH", sql.VarChar(10), id_user)
            .input("ID_PAYPAL", sql.VarChar(1000), id_Paypal)
            .input("UPDATE_TIME", sql.DateTime, dateUpdate)
            .input("EMAIL", sql.NVarChar(1000), checkData.email)
            .execute("CONFIRM_PAYPAL");
          res.send({ status: "success", message: "Confirm done" });
        } else
          res.send({
            status: "error",
            message:
              "There was an error during processing. Please contact support for help",
          });
      }
      if (checkData.status === "COMPLETED") {
        res.send({ status: "error", message: "Order has been confirm" });
      }
      if (checkData.status === "CREATED" || checkData.status === "VOIDED") {
        res.send({ status: "error", message: "Order has not been paid yet" });
      }
      if (checkData.status === "fail") {
        res.send({ status: "error", message: "Order has been cancel" });
      }
    } else {
      res.send({ status: "Not Found", message: "Not found data" });
    }
  }

  async CancelPaypal(req, res) {
    const bodyData = req.body.data;
    const id_Paypal = bodyData.id_Paypal;
    const id_user = bodyData.id_user;
    const dateUtc = new Date();
    const utcSec = dateUtc.getTime();
    const dateUpdate = new Date(utcSec + 3600000 * 7);
    let pool = await sql.connect(config);
    let check_user = await pool
      .request()
      .input("MA_KHACH", sql.VarChar(10), id_user)
      .input("ID_PAYPAL", sql.VarChar(1000), id_Paypal)
      .execute("CHECK_PAYPAL_PAYMENT");
    if (check_user.recordset.length != 0) {
      res.send({
        status: "success",
        id: check_user.recordset[0].MA_DONHANG,
      });
    } else res.send({ status: "Not Found", message: "Not found data" });
  }

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
      const id_district = tempData[0].THANHPHO;
      const id_ward = tempData[0].PHUONG;
      const id_service = await GetServiceShip(1452, id_district);
      let fee = await GetFeeShip(
        id_service,
        1452,
        "21014",
        id_district,
        id_ward
      );
      fee = Number((fee / 23750).toFixed(2));
      const secs = await GetDateShip(
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
          fee,
          dayShip,
        },
      });
    } catch (error) {
      res.send(error);
    }
  }

  async GetVoucher(req, res) {
    const id_user = req.body.id_user;
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("MA_KHACH", sql.VarChar(10), id_user)
      .execute("GET_VOUCHER");
    res.send(result.recordset);
  }
}

const getToken = async () => {
  const baseUrl = `${process.env.PAYPAL_LINK}/v1/oauth2/token`;
  const userName = process.env.PAYPAL_USERNAME;
  const password = process.env.PAYPAL_PASSWORD;
  await axios.request({
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "post",
    baseURL: baseUrl,
    data: "grant_type=client_credentials",
    auth: {
      username: userName,
      password: password,
    },
  });
  const response = await axios.request({
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "post",
    baseURL: baseUrl,
    data: "grant_type=client_credentials",
    auth: {
      username: userName,
      password: password,
    },
  });
  return response.data.access_token;
};

const CreateOrderPayPal = async (access_token, dataFormPayment) => {
  const baseUrl = `${process.env.PAYPAL_LINK}/v2/checkout/orders/`;
  const data = JSON.stringify({
    intent: "CAPTURE",
    purchase_units: [dataFormPayment],
    application_context: {
      return_url: "http://localhost:3000/order/confirmPaypal",
      cancel_url: "http://localhost:3000/order/cancelPaypal",
    },
  });
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  };

  const response = await axios.post(baseUrl, data, {
    headers: headers,
  });
  if (response.status === 201 || response.status === 200) {
    const returnData = {
      status: "success",
      id: response.data.id,
      linkCheckOut: response.data.links[1].href,
    };
    return returnData;
  } else return { status: "fail" };
};

const CheckOrderPaypal = async (access_token, id_paypal) => {
  const baseUrl = `${process.env.PAYPAL_LINK}/v2/checkout/orders/${id_paypal}`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const response = await axios.get(baseUrl, {
    headers: headers,
  });
  if (response.status === 200) {
    const returnData = {
      status: response.data.status,
      email:
        response.data.status === "CREATED"
          ? ""
          : response.data.payment_source.paypal.email_address != undefined
          ? response.data.payment_source.paypal.email_address
          : "",
    };
    return returnData;
  } else return { status: "fail" };
};

const ConfirmPaypal = async (access_token, id_paypal) => {
  const baseUrl = `${process.env.PAYPAL_LINK}/v2/checkout/orders/${id_paypal}/capture`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  const response = await axios.post(baseUrl, null, {
    headers: headers,
  });
  if (response.status === 201) {
    const returnData = {
      status: response.data.status,
    };
    return returnData;
  } else return { status: "fail" };
};

const GetAllInfo = async (listOrderItem, id_user, index_address, discount) => {
  // total
  // ship_fee
  // tax
  // discount
  // ship_discount
  let pool = await sql.connect(config);
  let get_address = await pool
    .request()
    .input("USERNAME", sql.VarChar(10), id_user)
    .input("STT", sql.Int, index_address)
    .execute("ADDRESS_USER_INDEX");
  const address_user = get_address.recordset[0];
  const full_info = `${address_user.SONHA_DUONG}, ${address_user.TEN_PHUONG}, ${address_user.TEN_THANHPHO}, ${address_user.TEN_TINH}`;
  let total = 0;
  const wait = listOrderItem.map(async (product) => {
    let get_price = await pool
      .request()
      .input("MA_SP", sql.VarChar(10), product.MA_SP)
      .input("STT", sql.Int, product.STT)
      .query(
        "SELECT GIA_BAN from CT_SANPHAM WHERE MA_SP = @MA_SP AND STT = @STT"
      );
    total += get_price.recordset[0].GIA_BAN * product.SL;
  });
  let get_info_Address = await pool
    .request()
    .input("MA_KHACH", sql.VarChar(10), id_user)
    .input("STT", sql.Int, index_address)
    .query(
      "SELECT PHUONG,THANHPHO,TINH from DIACHIGIAOHANG WHERE STT = @STT AND MA_KHACH = @MA_KHACH"
    );
  const info_Address = get_info_Address.recordset[0];
  const id_district = info_Address.THANHPHO;
  const id_ward = info_Address.PHUONG;
  const id_service = await GetServiceShip(1452, id_district);
  let fee = await GetFeeShip(id_service, 1452, "21014", id_district, id_ward);
  fee = Number((fee / 23750).toFixed(2));
  const secs = await GetDateShip(
    id_service,
    1452,
    "21014",
    id_district,
    id_ward
  );
  const now = new Date().getTime() / 1000;

  const dayShip = Math.ceil((secs - now + 7 * 3600) / 86400);
  const dateShip = `from ${dayShip - 1} - ${dayShip} days`;
  let get_MA_DH = await pool
    .request()
    .query("select count(*) as sl from DONDATHANG");
  const MA_DH = `DH${get_MA_DH.recordset[0].sl}`;
  return {
    MA_DH,
    total: total,
    ship_fee: fee,
    discount: 0,
    ship_discount: fee * (discount / 100),
    dateShip: dateShip,
    full_info,
  };
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

const GetFeeShip = async (
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

const GetDateShip = async (
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

const CheckItemOrder = async (listOrderItem, MA_GH) => {
  let check = 1;
  const wait = listOrderItem.map(async (product, index) => {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("MA_GH", sql.Int, MA_GH)
      .input("STT", sql.Int, product.STT)
      .input("MA_SP", sql.VarChar(10), product.MA_SP)
      .query(
        "SELECT * FROM CT_GIOHANG WHERE MA_SP =  @MA_SP AND STT = @STT AND MA_GH = @MA_GH"
      );
    if (result.recordset.length === 0) check = 0;
  });
  return Promise.all(wait).then(() => {
    return check;
  });
};

const CreatePaymentForm = async (listOrderItem, info) => {
  const itemOrderPayment = [];
  let pool = await sql.connect(config);

  const wait = listOrderItem.map(async (product, index) => {
    let result = await pool
      .request()
      .input("STT", sql.Int, product.STT)
      .input("MA_SP", sql.VarChar(10), product.MA_SP)
      .query(
        "select SP.TEN_SP,CTSP.TEN_CTSP,CTSP.GIA_BAN from CT_SANPHAM CTSP join sanpham SP on CTSP.MA_SP = SP.MA_SP WHERE CTSP.MA_SP = @MA_SP AND CTSP.STT = @STT"
      );
    const productDetail = result.recordset[0];
    const temp = {
      name: productDetail.TEN_SP,
      description: productDetail.TEN_CTSP,
      quantity: `${product.SL}`,
      unit_amount: {
        currency_code: "USD",
        value: `${productDetail.GIA_BAN}`,
      },
    };
    itemOrderPayment.push(temp);
  });
  const amount = {
    currency_code: "USD",
    value: `${(
      info.total +
      info.ship_fee -
      info.discount -
      info.ship_discount
    ).toFixed(2)}`,
    breakdown: {
      item_total: {
        currency_code: "USD",
        value: `${info.total}`,
      },
      shipping: {
        currency_code: "USD",
        value: `${info.ship_fee}`,
      },

      shipping_discount: {
        currency_code: "USD",
        value: `${info.ship_discount.toFixed(2)}`,
      },
    },
  };
  const shippingData = {
    type: "SHIPPING",
    address: {
      address_line_1: info.full_info,
      admin_area_2: "VN",
      country_code: "VN",
    },
  };
  return Promise.all(wait).then(() => {
    return {
      items: itemOrderPayment,
      amount: amount,
      shipping: shippingData,
    };
  });
};

module.exports = new UserController();

// const temp = {
//   name: product.detail.TEN_SP,
//   description: product.detail.TEN_CTSP,
//   quantity: `${product.amount}`,
//   unit_amount: {
//     currency_code: "USD",
//     value: `${product.price}`,
//   },
// };
// const temp2 = {
//   MA_SP: product.detail.MA_SP,
//   STT: product.detail.STT,
//   SO_LUONG: product.amount,
//   GIA: product.price,
// };
