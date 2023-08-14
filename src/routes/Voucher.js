const express = require("express");
const router = express.Router();

const VoucherController = require("../controllers/VoucherController");

router.get("/", VoucherController.GetVouchers);

module.exports = router;
