// BuyerDashboard — Main marketplace
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import { getWishlist, removeFromWishlist } from '../utils/wishlist';
import { addToCart } from '../utils/cart';
import BuyerLayout from '../components/BuyerLayout';

const categories = ["All", "Pottery", "Textiles", "Woodwork", "Jewelry", "Painting", "Home Goods"];

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('view') || 'home';

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

  useEffect(() => {
    if (activeView === 'wishlist') {
      setWishlist(getWishlist());
    }
  }, [activeView]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    setWishlist(getWishlist());
  };

  const handleMoveToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    handleRemoveFromWishlist(product._id);
  };

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const homeProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <BuyerLayout>
      <h1 className="text-4xl md:text-5xl font-serif text-[#F5F5F0] mb-8 border-b border-[#2A2A2A] pb-6">
        {activeView === 'home' ? (
          <>Discover <span className="text-[#C9A96E]">Art</span></>
        ) : activeView === 'categories' ? (
          <>Browse <span className="text-[#C9A96E]">Categories</span></>
        ) : (
          <>Your <span className="text-[#C9A96E]">Wishlist</span></>
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
        {activeView !== 'wishlist' && (activeView === 'home' ? homeProducts : filteredProducts).map((product, idx) => (
          <ProductCard
            key={product._id || idx}
            _id={product._id}
            name={product.name}
            price={product.price}
            category={product.category}
            image={product.image}
            currency="₹"
          />
        ))}
      </div>

      {activeView === 'wishlist' && (
        wishlist.length === 0 ? (
          <div className="text-[#9A9A8A] text-lg bg-[#1A1A1A] border border-[#2A2A2A] p-10 rounded-2xl text-center">
            Your wishlist is empty. Start exploring to save items!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishlist.map(product => (
              <div 
                key={product._id} 
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#C9A96E]/10 transition-all duration-300 transform hover:-translate-y-2 relative cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 pointer-events-none">
                    <Link 
                      to={`/product/${product._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#C9A96E] text-[#0F0F0F] px-8 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg pointer-events-auto hover:bg-[#d4b782] block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-6 pb-0">
                  <h3 className="text-xl font-semibold text-[#F5F5F0] mb-2 font-serif truncate group-hover:text-[#C9A96E] transition-colors">{product.name}</h3>
                  <p className="text-2xl font-bold text-[#C9A96E] mb-6">₹{product.price}</p>
                </div>
                <div className="px-6 pb-6">
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMoveToCart(product); }}
                      className="flex-1 bg-[#C9A96E] text-[#0F0F0F] py-2 rounded-xl font-bold hover:bg-[#d4b782] transition-colors pointer-events-auto"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(product._id); }}
                      className="px-4 bg-[#0F0F0F] border border-red-500/50 text-red-500 py-2 rounded-xl font-bold hover:bg-red-500/10 transition-colors pointer-events-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </BuyerLayout>
  );
}

export default BuyerDashboard;
