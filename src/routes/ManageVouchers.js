const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const ManageVouchersController = require("../controllers/ManageVouchersController");

router.get("/", ManageVouchersController.GetVouchers);
router.post("/", ManageVouchersController.AddVoucher);
router.put("/", ManageVouchersController.EditVoucher);
router.delete("/", ManageVouchersController.DeleteVoucher);

module.exports = router;
