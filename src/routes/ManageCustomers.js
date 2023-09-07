const express = require("express");
const router = express.Router();

const ManageCustomersController = require("../controllers/ManageCustomersController");

router.get("/manage-customers", ManageCustomersController.GetData);
module.exports = router;