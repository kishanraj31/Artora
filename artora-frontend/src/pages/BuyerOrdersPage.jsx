// BuyerOrdersPage — buyer order history
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBuyerOrders } from '../services/orderService';
import BuyerLayout from '../components/BuyerLayout';

function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      // Clean up location state
      window.history.replaceState({}, document.title);
    }

    const fetchOrders = async () => {
      try {
        const data = await getBuyerOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [location]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'processing': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <BuyerLayout>
      <div className="font-sans text-[#F5F5F0]">
        <div className="max-w-4xl mx-auto">
          
          {showSuccess && (
            <div className="bg-[#C9A96E]/20 border border-[#C9A96E] text-[#C9A96E] px-6 py-4 rounded-xl mb-8 flex justify-center text-lg shadow-lg">
              🎉 Order placed successfully! Your artisan is preparing your item.
            </div>
          )}

          <h1 className="text-4xl font-serif text-[#F5F5F0] mb-8 border-b border-[#2A2A2A] pb-6">Your Orders</h1>

          {loading ? (
            <div className="text-[#C9A96E] text-xl font-medium animate-pulse">Loading orders...</div>
          ) : error ? (
            <div className="text-red-500 text-xl">{error}</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-serif text-[#C9A96E] mb-4">No orders yet</h2>
              <p className="text-[#9A9A8A] mb-8 text-lg">Start exploring handcrafted art!</p>
              <button 
                onClick={() => navigate('/buyer')}
                className="bg-[#C9A96E] text-[#0F0F0F] px-8 py-3 rounded-xl font-bold hover:bg-[#d4b782] transition-colors"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-[#1A1A1A] border-l-4 border-[#C9A96E] border-t border-r border-b border-t-[#2A2A2A] border-r-[#2A2A2A] border-b-[#2A2A2A] rounded-r-2xl rounded-l-md p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  
                  <div 
                    className="flex flex-col md:flex-row gap-6 items-start md:items-center flex-1 cursor-pointer group"
                    onClick={() => order.product && navigate(`/product/${order.product._id}`)}
                  >
                    <img src={order.product?.image} alt={order.product?.name} className="w-20 h-20 object-cover rounded-xl border border-[#2A2A2A] shrink-0 group-hover:border-[#C9A96E] transition-colors" />
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-serif text-[#F5F5F0] mb-1 group-hover:text-[#C9A96E] transition-colors">{order.product?.name || 'Product unavailable'}</h3>
                      <p className="text-sm text-[#9A9A8A] mb-1">Sold by: {order.sellerId?.name || 'Unknown'}</p>
                      <p className="text-sm text-[#9A9A8A]">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-[#9A9A8A] mt-1">
                        Order ID: <span className="font-mono text-[#F5F5F0]">{order._id.substring(0, 8)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <div className="text-xl font-bold text-[#C9A96E]">
                      ₹{order.totalAmount}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      {order.paymentStatus === 'paid' && (
                        <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </BuyerLayout>
  );
}

export default BuyerOrdersPage;
