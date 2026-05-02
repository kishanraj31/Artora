// productController — product CRUD
const Product = require('../models/Product');

// Fetch all products available in the database
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch a single product by its unique ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new product linked to the requesting seller
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      sellerId: req.user.userId
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing product ensuring the requester is the owner
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this product' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch all products owned by the currently authenticated seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.userId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching seller products', error: error.message });
  }
};
