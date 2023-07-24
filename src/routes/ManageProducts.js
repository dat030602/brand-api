const express = require('express');
const router = express.Router();

const ManageProductsController = require('../controllers/ManageProductsController');

//For searching
router.get('/', ManageProductsController.GetProducts);
router.get('/:slug', ManageProductsController.GetList);
router.get('/searchcategory/:slug', ManageProductsController.GetProductsByCategory);
router.get('/category/:slug/:slug1', ManageProductsController.GetListByCategory);

router.post('/', ManageProductsController.AddProduct);
router.put('/', ManageProductsController.EditProduct);
router.put('/edit-detail-product', ManageProductsController.EditDetailProduct);
router.delete('/', ManageProductsController.DeleteProduct);

module.exports = router;