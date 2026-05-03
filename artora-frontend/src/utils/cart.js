// cart — localStorage cart management

export const getCart = () => {
  try {
    const cart = localStorage.getItem('artora_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item._id === product._id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('artora_cart', JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item._id !== productId);
  localStorage.setItem('artora_cart', JSON.stringify(updatedCart));
  return updatedCart;
};

export const clearCart = () => {
  localStorage.removeItem('artora_cart');
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
};
