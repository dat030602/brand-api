const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const ManageProductsController = require("../controllers/ManageProductsController");

router.get("/", ManageProductsController.GetProducts);
router.get("/type-product", ManageProductsController.GetTypeProduct);
router.post("/", upload.fields([{ name: "imageUpload", maxCount: 10 }]), ManageProductsController.AddProduct);
router.post(
	"/detail",
	upload.fields([{ name: "imageUpload", maxCount: 1 }]),
	ManageProductsController.AddDetailProduct
);
router.put("/edit/ten-san-pham", ManageProductsController.EditProduct_TEN_SP);
router.put("/edit/ten-loai-san-pham", ManageProductsController.EditProduct_TEN_LOAI_SP);
router.put("/edit/mo-ta", ManageProductsController.EditProduct_MO_TA);
router.put("/edit/brand", ManageProductsController.EditProduct_BRAND);
router.put("/edit/ten-chi-tiet-san-pham", ManageProductsController.EditDetailProduct_TEN_CTSP);
router.put("/edit/gia-ban", ManageProductsController.EditDetailProduct_GIA_BAN);
router.put("/edit/gia-nhap", ManageProductsController.EditDetailProduct_GIA_NHAP);
router.put("/edit/so-luong-kho", ManageProductsController.EditDetailProduct_SL_KHO);
router.put("/edit/hinh-anh", ManageProductsController.EditDetailProduct_HINHANHSP);
router.delete("/delete-detail", ManageProductsController.DeleteDetailProduct);
router.delete("/", ManageProductsController.DeleteProduct);

module.exports = router;
