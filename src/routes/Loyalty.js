const express = require('express');
const router = express.Router();

const LoyaltyController = require('../controllers/LoyaltyController');

router.get('/', LoyaltyController.GetRewardPoint);

module.exports = router;
