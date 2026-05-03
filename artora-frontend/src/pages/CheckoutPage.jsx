// CheckoutPage — address and mock payment
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../utils/cart';
import { createOrder } from '../services/orderService';
import BuyerLayout from '../components/BuyerLayout';

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const currentCart = getCart();
    if (currentCart.length === 0) {
      navigate('/buyer');
    } else {
      setCart(currentCart);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Required';
    if (!form.phone || form.phone.length !== 10) newErrors.phone = '10 digits required';
    if (!form.addressLine) newErrors.addressLine = 'Required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.state) newErrors.state = 'Required';
    if (!form.pincode || form.pincode.length !== 6) newErrors.pincode = '6 digits required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      for (const item of cart) {
        await createOrder({
          productId: item._id,
          quantity: item.quantity,
          shippingAddress: form,
          totalAmount: item.price * item.quantity,
          paymentStatus: 'paid'
        });
      }
      clearCart();
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  return (
    <BuyerLayout>
      <div className="font-sans text-[#F5F5F0]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-[55%]">
            <h1 className="text-4xl font-serif text-[#F5F5F0] mb-8">Delivery Address</h1>
            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-[#C9A96E] mb-2">Full Name</label>
                <input 
                  type="text" name="fullName" value={form.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] focus:border-[#C9A96E] rounded-xl text-[#F5F5F0] outline-none transition-colors"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9A96E] mb-2">Phone Number</label>
                <input 
                  type="text" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] focus:border-[#C9A96E] rounded-xl text-[#F5F5F0] outline-none transition-colors"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9A96E] mb-2">Address Line</label>
                <input 
                  type="text" name="addressLine" value={form.addressLine} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] focus:border-[#C9A96E] rounded-xl text-[#F5F5F0] outline-none transition-colors"
                />
                {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#C9A96E] mb-2">City</label>
                  <input 
                    type="text" name="city" value={form.city} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] focus:border-[#C9A96E] rounded-xl text-[#F5F5F0] outline-none transition-colors"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#C9A96E] mb-2">State</label>
                  <input 
                    type="text" name="state" value={form.state} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] focus:border-[#C9A96E] rounded-xl text-[#F5F5F0] outline-none transition-colors"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9A96E] mb-2">Pincode</label>
                <input 
                  type="text" name="pincode" value={form.pincode} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] focus:border-[#C9A96E] rounded-xl text-[#F5F5F0] outline-none transition-colors"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>

            </form>
          </div>
          
          <div className="lg:w-[45%]">
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
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#C9A96E] text-[#0F0F0F] py-4 rounded-xl font-bold text-lg hover:bg-[#d4b782] transition-colors disabled:opacity-70 disabled:hover:bg-[#C9A96E]"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </BuyerLayout>
  );
}

export default CheckoutPage;
