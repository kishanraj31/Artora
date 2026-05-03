// ProductDetailPage — full product view
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../utils/cart';
import { addToWishlist, isInWishlist } from '../utils/wishlist';
import { isLoggedIn } from '../utils/auth';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedCartMsg, setAddedCartMsg] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setInWishlist(isInWishlist(data._id));
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    const productToAdd = { ...product, quantity };
    addToCart(productToAdd);
    setAddedCartMsg(true);
    setTimeout(() => setAddedCartMsg(false), 2000);
  };

  const handleAddToWishlist = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    addToWishlist(product);
    setInWishlist(true);
  };

  const incrementQty = () => {
    if (quantity < 10) setQuantity(q => q + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  if (loading) return <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex items-center justify-center text-[#C9A96E] text-xl font-medium animate-pulse">Loading...</div>;
  if (error) return <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex items-center justify-center text-red-500 text-xl">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] font-sans text-[#F5F5F0] p-8 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 relative">
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute -left-4 top-4 md:-left-16 md:top-0 w-10 h-10 flex items-center justify-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] text-[#C9A96E] hover:bg-[#2A2A2A] transition-colors font-bold z-10"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>

          <div className="md:w-[60%] h-[500px] md:h-[600px]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-2xl border border-[#2A2A2A]"
            />
          </div>
          
          <div className="md:w-[40%] flex flex-col">
            <span className="text-xs bg-[#0F0F0F] text-[#C9A96E] px-3 py-1.5 rounded-full border border-[#2A2A2A] font-semibold tracking-wider uppercase w-max mb-6">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F5F5F0] mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-[#C9A96E] mb-2">₹{product.price}</p>
            <p className="text-[#9A9A8A] mb-6">Crafted by <span className="text-[#F5F5F0]">{product.sellerId?.name || 'Unknown Artisan'}</span></p>
            
            <div className="text-[#F5F5F0] text-lg leading-relaxed mb-8">
              {product.description}
            </div>
            
            <hr className="border-[#2A2A2A] mb-8" />
            
            <div className="flex items-center gap-6 mb-8">
              <span className="text-[#9A9A8A]">Quantity</span>
              <div className="flex items-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden shrink-0 w-max">
                <button onClick={decrementQty} className="px-4 py-2 text-[#C9A96E] hover:bg-[#2A2A2A] transition-colors font-bold text-xl">-</button>
                <span className="px-4 font-bold w-12 text-center">{quantity}</span>
                <button onClick={incrementQty} className="px-4 py-2 text-[#C9A96E] hover:bg-[#2A2A2A] transition-colors font-bold text-xl">+</button>
              </div>
            </div>
          
          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#C9A96E] text-[#0F0F0F] py-4 rounded-xl font-bold text-lg hover:bg-[#d4b782] transition-colors"
            >
              {addedCartMsg ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="w-full bg-[#0F0F0F] border border-[#C9A96E] text-[#C9A96E] py-4 rounded-xl font-bold text-lg hover:bg-[#C9A96E]/10 transition-colors"
            >
              {inWishlist ? 'In Wishlist ✓' : 'Add to Wishlist'}
            </button>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 flex flex-col gap-3 text-sm text-[#9A9A8A]">
            <p>🚚 Free delivery on orders above ₹999</p>
            <p>📦 Estimated delivery: 5-7 business days</p>
            <p>🤝 Handcrafted with care by local artisans</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
