// orderController — order creation and management
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, totalAmount } = req.body;
    
    // Find product to get sellerId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({
      buyerId: req.user.userId,
      sellerId: product.sellerId,
      product: productId,
      quantity,
      totalAmount,
      shippingAddress,
      paymentStatus: req.body.paymentStatus || 'paid'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.userId })
      .populate('product', 'name image price')
      .populate('sellerId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting buyer orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.userId })
      .populate('product', 'name image price')
      .populate('buyerId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the seller of this order' });
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
