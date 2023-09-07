const express = require("express");
const router = express.Router();

const PersonalInfoController = require("../controllers/PersonalInfoController");

router.get("/", PersonalInfoController.GetInfo);
router.get("/address", PersonalInfoController.GetAddress);
router.post("/", PersonalInfoController.AddAddress);
router.put("/", PersonalInfoController.EditAddress);
router.delete("/", PersonalInfoController.DeleteAddress);

module.exports = router;
