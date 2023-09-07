const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");

router.get("/", ProductController.GetProduct);
router.post("/add-to-cart", ProductController.AddToCart);
router.post("/favorite", ProductController.Favorite);

module.exports = router;
