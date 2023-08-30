const express = require('express');
const router = express.Router();

const CartController = require('../controllers/CartController');

router.get('/', CartController.GetAllCart);
router.delete('/', CartController.RemoveFromCart);
router.put('/', CartController.UpdateQuantity);

module.exports = router;
