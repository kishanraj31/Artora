// Product routes — CRUD endpoints
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/seller/mine
// @desc    Get products by seller
// @access  Private (Seller only)
router.get('/seller/mine', protect, restrictTo('seller'), productController.getSellerProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a product
// @access  Private (Seller only)
router.post('/', protect, restrictTo('seller'), productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Seller only - Owner)
router.put('/:id', protect, restrictTo('seller'), productController.updateProduct);

module.exports = router;
