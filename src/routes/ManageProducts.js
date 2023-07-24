const express = require('express');
const router = express.Router();

const ManageProductsController = require('../controllers/ManageProductsController');


router.get('/', ManageProductsController.GetProducts);
//For searching
router.get('/all', ManageProductsController.GetAll);
router.get('/:slug', ManageProductsController.GetList);
router.get('/searchcategory/:slug', ManageProductsController.GetProductsByCategory);
router.get('/category/:slug/:slug1', ManageProductsController.GetListByCategory);

router.get('/type-product', ManageProductsController.GetTypeProduct);
router.post('/', ManageProductsController.AddProduct);
router.put('/edit/ten-san-pham', ManageProductsController.EditProduct_TEN_SP);
router.put('/edit/ten-loai-san-pham', ManageProductsController.EditProduct_TEN_LOAI_SP);
router.put('/edit/mo-ta', ManageProductsController.EditProduct_MO_TA);
router.put('/edit/brand', ManageProductsController.EditProduct_BRAND);
router.put('/edit/ten-chi-tiet-san-pham', ManageProductsController.EditDetailProduct_TEN_CTSP);
router.put('/edit/gia-ban', ManageProductsController.EditDetailProduct_GIA_BAN);
router.put('/edit/gia-nhap', ManageProductsController.EditDetailProduct_GIA_NHAP);
router.put('/edit/so-luong-kho', ManageProductsController.EditDetailProduct_SL_KHO);
router.put('/edit/hinh-anh', ManageProductsController.EditDetailProduct_HINHANHSP);
router.delete('/delete-detail', ManageProductsController.DeleteDetailProduct);
router.delete('/', ManageProductsController.DeleteProduct);

module.exports = router;