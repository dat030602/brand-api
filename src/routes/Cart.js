const express = require("express");
const router = express.Router();

const CartController = require("../controllers/CartController");

router.get("/", CartController.GetAllCart);

module.exports = router;
