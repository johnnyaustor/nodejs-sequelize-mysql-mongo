const path = require('path');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.put('/product/:productId', adminController.putEditProduct);
router.delete('/product/:productId', adminController.deleteProduct);

module.exports = router;