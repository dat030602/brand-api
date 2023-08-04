const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const ManageVouchersController = require("../controllers/ManageVouchersController");

router.get("/", ManageVouchersController.GetVouchers);
router.post("/", upload.fields([{ name: "imageUpload", maxCount: 1 }]), ManageVouchersController.AddVoucher);
router.put("/edit/ten-san-pham", ManageVouchersController.EditVoucher_TEN_SP);
router.put("/edit/ten-loai-san-pham", ManageVouchersController.EditVoucher_TEN_LOAI_SP);
router.put("/edit/mo-ta", ManageVouchersController.EditVoucher_MO_TA);
router.put("/edit/brand", ManageVouchersController.EditVoucher_BRAND);
router.put("/edit/ten-chi-tiet-san-pham", ManageVouchersController.EditDetailVoucher_TEN_CTSP);
router.put("/edit/gia-ban", ManageVouchersController.EditDetailVoucher_GIA_BAN);
router.put("/edit/gia-nhap", ManageVouchersController.EditDetailVoucher_GIA_NHAP);
router.put("/edit/so-luong-kho", ManageVouchersController.EditDetailVoucher_SL_KHO);
router.put("/edit/hinh-anh", ManageVouchersController.EditDetailVoucher_HINHANHSP);
router.delete("/", ManageVouchersController.DeleteVoucher);

module.exports = router;
