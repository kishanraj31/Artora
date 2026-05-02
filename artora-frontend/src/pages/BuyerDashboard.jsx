// BuyerDashboard — Main marketplace
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import { isLoggedIn } from '../utils/auth';

const categories = ["All", "Pottery", "Textiles", "Woodwork", "Jewelry", "Painting", "Home Goods"];

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeView, setActiveView] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSidebarClick = (item) => {
    if (item === 'home' || item === 'categories') {
      setActiveView(item);
    } else {
      if (!isLoggedIn()) {
        setShowAuthModal(true);
      } else {
        // Feature coming soon for logged-in users
      }
    }
  };

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const homeProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 6);

  const getSidebarClass = (item) => {
    const isActive = activeView === item;
    return `px-4 py-3 cursor-pointer font-medium rounded-lg transition-colors ${
      isActive 
        ? 'text-[#C9A96E] border-l-2 border-[#C9A96E] bg-[#1A1A1A] rounded-l-none' 
        : 'text-[#9A9A8A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]/50'
    }`;
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex font-sans text-[#F5F5F0]">
      <div className="w-64 bg-[#111111] border-r border-[#2A2A2A] min-h-[calc(100vh-73px)] p-8 hidden md:block">
        <ul className="space-y-3 mt-4">
          <li onClick={() => handleSidebarClick('home')} className={getSidebarClass('home')}>
            Home
          </li>
          <li onClick={() => handleSidebarClick('categories')} className={getSidebarClass('categories')}>
            Categories
          </li>
          <li>
            <div onClick={() => handleSidebarClick('wishlist')} className={getSidebarClass('wishlist')}>
              Wishlist
            </div>
          </li>
          <li>
            <div onClick={() => handleSidebarClick('cart')} className={getSidebarClass('cart')}>
              Cart
            </div>
          </li>
          <li>
            <div onClick={() => handleSidebarClick('orders')} className={getSidebarClass('orders')}>
              Orders
            </div>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16 relative">
        <h1 className="text-4xl md:text-5xl font-serif text-[#F5F5F0] mb-8 border-b border-[#2A2A2A] pb-6">
          {activeView === 'home' ? (
            <>Discover <span className="text-[#C9A96E]">Art</span></>
          ) : (
            <>Browse <span className="text-[#C9A96E]">Categories</span></>
          )}
        </h1>

        {activeView === 'categories' && (
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#C9A96E] text-[#0F0F0F]'
                    : 'bg-[#1A1A1A] border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-[#C9A96E] text-xl font-medium animate-pulse">Loading amazing art...</p>}
        {error && <p className="text-[#C9A96E] text-sm mb-4">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-[#9A9A8A] text-lg">No products listed yet. Check back soon.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {(activeView === 'home' ? homeProducts : filteredProducts).map((product, idx) => (
            <ProductCard
              key={product._id || idx}
              name={product.name}
              price={product.price}
              category={product.category}
              image={product.image}
              currency="₹"
            />
          ))}
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[#9A9A8A] hover:text-[#F5F5F0] text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-serif text-[#C9A96E] mb-4">Sign in to Artora</h3>
            <p className="text-[#9A9A8A] mb-8 text-lg">Create an account to save your wishlist, track orders, and checkout.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#C9A96E] text-[#0F0F0F] px-8 py-3 rounded-xl font-bold hover:bg-[#d4b782] transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#0F0F0F] border border-[#C9A96E] text-[#C9A96E] px-8 py-3 rounded-xl font-bold hover:bg-[#C9A96E]/10 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
