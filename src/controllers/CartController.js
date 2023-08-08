const config = require("../DbConfig");
const sql = require("mssql");
class CartController {
  async index(req, res) {}
  // [GET] /
  GetAllCart(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            // mã sản phẩm, tên, phân loại, số lượng trong giỏ, giá, số lượng tồn kho
            .query(
              `SELECT sp.TEN_SP, ctsp.TEN_CTSP, ctgh.SO_LUONG, ctsp.GIA_BAN, ctsp.SL_KHO FROM dbo.CT_GIOHANG ctgh join V_CT_SANPHAM ctsp on ctsp.STT=ctgh.STT and ctsp.MA_SP=ctgh.MA_SP
          join SANPHAM sp on sp.MA_SP=ctsp.MA_SP `
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
      res.json(response?.recordset);
    });
  }
}

module.exports = new CartController();
