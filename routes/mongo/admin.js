const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/mongo/admin');

router.get('/product', adminController.getAddProduct);
router.post('/product', adminController.postAddProduct);
router.put('/product/:productId', adminController.putEditProduct);
router.delete('/product/:productId', adminController.deleteProduct);

module.exports = router;