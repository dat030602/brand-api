const express = require("express");
const router = express.Router();

const ManageCustomersController = require("../controllers/ManageCustomersController");
router.get("/", ManageCustomersController.GetAllCustomers);
router.put("/edit", ManageCustomersController.EditCustomer);
module.exports = router;