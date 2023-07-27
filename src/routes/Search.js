const express = require('express');
const router = express.Router();

const SearchController = require('../controllers/SearchController');

//For searching
router.get('/all', SearchController.GetAll);
router.get('/:slug', SearchController.GetList);
router.get('/searchcategory/:slug', SearchController.GetProductsByCategory);
router.get('/category/:slug/:slug1', SearchController.GetListByCategory);

module.exports = router;