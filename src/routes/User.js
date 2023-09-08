const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/province', UserController.Province);
router.get('/district', UserController.District);
router.get('/ward', UserController.Ward);
router.get('/cartitem', UserController.GetCartItem);
router.get('/address', UserController.Address);
router.post('/payment', UserController.Payment);
router.get('/shipdata', UserController.GetShipData);
router.post('/voucher', UserController.GetVoucher);
router.put('/updateCart', UserController.ChangeItemCartAmount);
router.post('/confirmPaypal', UserController.ConfirmPaypal);
router.post('/cancelPaypal', UserController.CancelPaypal);
router.get('/returnVnPay', UserController.ReturnVnPay);
router.get('/checkexpire', UserController.CheckExpired);
router.post('/cancelOrder', UserController.CancelOrder);

// router.post("/checkout",UserController.CheckOut)
module.exports = router;
