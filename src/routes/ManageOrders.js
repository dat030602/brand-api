const express = require("express");
const router = express.Router();

const ManageOrdersController = require("../controllers/ManageOrdersController");

router.get("/", ManageOrdersController.GetAllOrders);
router.get("/order-detail/:slug", ManageOrdersController.GetOrderDetail);
router.put(
  "/order-detail/:slug/:slug1",
  ManageOrdersController.UpdateOrderStatus
);

module.exports = router;
