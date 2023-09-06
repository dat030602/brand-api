const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/DashboardController");

router.get("/", DashboardController.GetData);
router.get("/statistic/all", DashboardController.GetData_Statistics_All);
router.get("/statistic/month", DashboardController.GetData_Statistics_Month);
router.get("/statistic/year", DashboardController.GetData_Statistics_Year);

module.exports = router;
