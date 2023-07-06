const express = require('express');
const router = express.Router();

const ManageProductsController = require('../controllers/ManageProductsController');

router.get('/', ManageProductsController.GetProducts);
router.post('/', ManageProductsController.AddProduct);
router.put('/', ManageProductsController.EditProduct);
router.put('/edit-detail-product', ManageProductsController.EditDetailProduct);
router.delete('/', ManageProductsController.DeleteProduct);

module.exports = router;