// orderService — order API calls
import api from '../utils/api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getBuyerOrders = async () => {
  const response = await api.get('/orders/buyer');
  return response.data;
};

export const getSellerOrders = async () => {
  const response = await api.get('/orders/seller');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};
