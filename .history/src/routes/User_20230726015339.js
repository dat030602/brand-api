const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");

router.get("/province", UserController.Province);
router.get("/district", UserController.District);
router.get("/ward", UserController.Ward);
router.get("/cartitem", UserController.GetCartItem);
router.put("/updateCart",UserController.UpdateCart);
module.exports = router;
