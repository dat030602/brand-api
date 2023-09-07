const express = require('express');
const router = express.Router();

const SearchController = require('../controllers/SearchController');

//For searching
router.get('/all', SearchController.GetAll);
router.get('/category', SearchController.GetProductsByCategory);
router.get('/find', SearchController.GetListByCategory);
router.get('/findall', SearchController.GetList);
router.get('/brand/all', SearchController.GetAllBrand);
router.get('/filter', SearchController.GetAllByFilter);
module.exports = router;