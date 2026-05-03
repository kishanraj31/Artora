// wishlist — localStorage wishlist management

export const getWishlist = () => {
  try {
    const wishlist = localStorage.getItem('artora_wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    return [];
  }
};

export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  if (!wishlist.some(item => item._id === product._id)) {
    wishlist.push(product);
  }
  localStorage.setItem('artora_wishlist', JSON.stringify(wishlist));
  return wishlist;
};

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(item => item._id !== productId);
  localStorage.setItem('artora_wishlist', JSON.stringify(updatedWishlist));
  return updatedWishlist;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(item => item._id === productId);
};
