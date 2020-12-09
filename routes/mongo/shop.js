const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/mongo/admin');
const shopController = require('../../controllers/mongo/shop');

router.get('/', adminController.getProducts);
router.get('/products', adminController.getProducts);
router.get('/products/:productId', adminController.getProduct);
router.post('/cart', shopController.postCart);
router.get('/cart', shopController.getCart);
router.delete('/cart/:productId', shopController.deleteCart);
router.post('/order', shopController.postOrder);
router.get('/order', shopController.getOrders);

module.exports = router;