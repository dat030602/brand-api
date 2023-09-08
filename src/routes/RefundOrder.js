const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const RefundOrderController = require('../controllers/RefundOrderController');

router.post('/', upload.fields([{ name: 'imageUpload', maxCount: 1 }]), RefundOrderController.AddNewRefundRequest);
router.put('/:slug/cancel', RefundOrderController.CancelRefund);
router.get('/:slug/', RefundOrderController.GetOrderRefundRequest);
router.get('/:slug/detail', RefundOrderController.GetRefundDetail);

module.exports = router;
