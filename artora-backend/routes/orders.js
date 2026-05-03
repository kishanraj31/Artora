// Order routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('buyer'), orderController.createOrder);
router.get('/buyer', protect, restrictTo('buyer'), orderController.getBuyerOrders);
router.get('/seller', protect, restrictTo('seller'), orderController.getSellerOrders);
router.put('/:orderId/status', protect, restrictTo('seller'), orderController.updateOrderStatus);

module.exports = router;
