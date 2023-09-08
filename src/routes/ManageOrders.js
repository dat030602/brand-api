const express = require('express');
const router = express.Router();

const ManageOrdersController = require('../controllers/ManageOrdersController');

router.get('/history', ManageOrdersController.GetOrderHistory);
router.get('/', ManageOrdersController.GetAllOrders);
router.get('/:slug', ManageOrdersController.GetOneOrderInfo);
router.get('/:slug/order-detail', ManageOrdersController.GetOrderDetail);
router.put('/:slug/:slug1', ManageOrdersController.UpdateOrderStatus);
router.get('/:slug/refund-request', ManageOrdersController.GetOrderRefundRequest);
router.get('/:slug/refund-request/detail', ManageOrdersController.GetRefundDetail);
router.put('/:slug/refund-request/update', ManageOrdersController.UpdateRefundStatus);

module.exports = router;
