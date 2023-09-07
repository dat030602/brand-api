const config = require('../DbConfig');
const sql = require('mssql');
const sign = require('jwt-encode');

class PersonalInfoController {
  async index(req, res) {}
  // [GET] /
  GetInfo(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .query(`select HO_TEN, EMAIL, SDT from KHACHHANG where TEN_TK='${req.query.username}';
            select STT,SONHA_DUONG, t.TEN_TINH TINH, tp.TEN_THANHPHO THANHPHO, p.TEN_PHUONG PHUONG from DIACHIGIAOHANG dcgh
            join TINH t on dcgh.TINH=t.MA_TINH
            join THANHPHO tp on dcgh.THANHPHO=tp.MA_THANHPHO and tp.MA_TINH=t.MA_TINH
            join PHUONG p on dcgh.PHUONG=p.MA_PHUONG and p.MA_THANHPHO =tp.MA_THANHPHO where MA_KHACH = '${req.query.username}';
            select * from TINH;select * from THANHPHO;select * from PHUONG
            `)
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
      res.json(response?.recordsets);
    });
  }
  // [GET] /address
  GetAddress(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .query(`select STT,SONHA_DUONG, t.TEN_TINH TINH, tp.TEN_THANHPHO THANHPHO, p.TEN_PHUONG PHUONG from DIACHIGIAOHANG dcgh
            join TINH t on dcgh.TINH=t.MA_TINH
            join THANHPHO tp on dcgh.THANHPHO=tp.MA_THANHPHO and tp.MA_TINH=t.MA_TINH
            join PHUONG p on dcgh.PHUONG=p.MA_PHUONG and p.MA_THANHPHO =tp.MA_THANHPHO where MA_KHACH = '${req.query.username}'
            `)
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
      res.json(response?.recordset);
    });
  }
  // [POST] /
  AddAddress(req, res) {
    const func = async () => {
      try {
        let result;
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input("username", sql.VarChar(10), req.body.data.username)
            .input("tinh", sql.Int, req.body.data.data.TINH)
            .input("thanhpho", sql.Int, req.body.data.data.THANHPHO)
            .input("phuong", sql.VarChar(7), req.body.data.data.PHUONG)
            .input("sonha_duong", sql.NVarChar(1000), req.body.data.data.SONHA_DUONG)
            .execute("dbo.SP_Add_Address")
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
    func().then((resReturn) => {
      res.json(resReturn?.returnValue);
    });
  }
  // [PUT] /
  EditAddress(req, res) {
    const func = async () => {
      try {
        let result;
        console.log(req.body.data)
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input("username", sql.VarChar(10), req.body.data.username)
            .input("stt", sql.Int, req.body.data.data.STT)
            .input("tinh", sql.Int, req.body.data.data.TINH)
            .input("thanhpho", sql.Int, req.body.data.data.THANHPHO)
            .input("phuong", sql.VarChar(7), req.body.data.data.PHUONG)
            .input("sonha_duong", sql.NVarChar(1000), req.body.data.data.SONHA_DUONG)
            .execute("dbo.SP_Edit_Address")
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
    func().then((resReturn) => {
      res.json(resReturn?.returnValue);
    });
  }
  // [DELETE] /
  DeleteAddress(req, res) {
    const func = async () => {
      try {
        let result;
        console.log(req.body)
        await sql.connect(config).then((conn) =>
          conn
            .request()
            .input("username", sql.VarChar(10), req.body.username)
            .input("stt", sql.Int, req.body.stt)
            .execute("dbo.SP_Delete_Address")
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
    func().then((resReturn) => {
      res.json(resReturn?.returnValue);
    });
  }
}

module.exports = new PersonalInfoController();
