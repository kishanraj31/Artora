// CartPage — buyer cart
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, removeFromCart, clearCart } from '../utils/cart';
import { isLoggedIn } from '../utils/auth';
import BuyerLayout from '../components/BuyerLayout';

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
      return;
    }
    const updatedCart = cart.map(item => 
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('artora_cart', JSON.stringify(updatedCart));
  };

  const handleRemove = (productId) => {
    const updated = removeFromCart(productId);
    setCart(updated);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex flex-col items-center justify-center font-sans text-[#F5F5F0]">
        <h2 className="text-3xl font-serif text-[#C9A96E] mb-6">Login to view your cart</h2>
        <button 
          onClick={() => navigate('/login')}
          className="bg-[#C9A96E] text-[#0F0F0F] px-8 py-3 rounded-xl font-bold hover:bg-[#d4b782] transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="font-sans text-[#F5F5F0] flex flex-col items-center justify-center py-24">
          <h2 className="text-3xl font-serif text-[#C9A96E] mb-6">Your cart is empty</h2>
          <Link to="/buyer" className="text-[#9A9A8A] hover:text-[#F5F5F0] border-b border-[#C9A96E] pb-1 transition-colors">
            Explore
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  return (
    <BuyerLayout>
      <div className="font-sans text-[#F5F5F0]">
        <h1 className="text-4xl font-serif text-[#F5F5F0] mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-[65%] flex flex-col gap-6">
            {cart.map(item => (
              <div key={item._id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex gap-6 items-center">
                <div 
                  className="flex gap-6 items-center flex-1 min-w-0 cursor-pointer group"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-[#2A2A2A] group-hover:border-[#C9A96E] transition-colors" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-serif text-[#F5F5F0] truncate group-hover:text-[#C9A96E] transition-colors">{item.name}</h3>
                    <span className="text-xs text-[#C9A96E] tracking-wider uppercase">{item.category}</span>
                    <p className="text-[#9A9A8A] mt-1">₹{item.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg overflow-hidden shrink-0">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 text-[#C9A96E] hover:bg-[#2A2A2A] transition-colors font-bold">-</button>
                  <span className="px-3 font-bold w-10 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 text-[#C9A96E] hover:bg-[#2A2A2A] transition-colors font-bold">+</button>
                </div>
                
                <div className="text-xl font-bold text-[#C9A96E] w-24 text-right shrink-0">
                  ₹{item.price * item.quantity}
                </div>
                
                <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-400 font-bold px-2 text-xl shrink-0">
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="lg:w-[35%]">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 sticky top-24">
              <h2 className="text-2xl font-serif text-[#F5F5F0] mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm text-[#9A9A8A]">
                    <span className="truncate pr-4">{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <hr className="border-[#2A2A2A] mb-6" />
              
              <div className="flex justify-between mb-4">
                <span className="text-[#9A9A8A]">Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-[#9A9A8A]">Delivery</span>
                <span className="font-bold">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              
              <hr className="border-[#2A2A2A] mb-6" />
              
              <div className="flex justify-between mb-8">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-[#C9A96E]">₹{total}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#C9A96E] text-[#0F0F0F] py-4 rounded-xl font-bold text-lg hover:bg-[#d4b782] transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}

export default CartPage;
