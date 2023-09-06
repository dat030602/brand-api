const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const RefundOrderController = require('../controllers/RefundOrderController');

router.post('/', upload.fields([{ name: 'imageUpload', maxCount: 10 }]), RefundOrderController.AddNewRefundRequest);
// router.post('/detail', upload.fields([{ name: 'imageUpload', maxCount: 1 }]), RefundOrderController.AddRefundDetail);
module.exports = router;
