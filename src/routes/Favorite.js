const express = require("express");
const router = express.Router();

const FavoriteController = require("../controllers/FavoriteController");

router.get("/", FavoriteController.GetProducts);
router.delete("/", FavoriteController.DeleteFavorite);

module.exports = router;
