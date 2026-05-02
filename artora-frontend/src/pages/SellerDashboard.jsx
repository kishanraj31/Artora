// SellerDashboard — seller portal
import { useState, useEffect } from 'react';
import { createProduct, getSellerProducts } from '../services/productService';
import { getUser } from '../utils/auth';

function SellerDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sellerName, setSellerName] = useState('');
  
  const [myProducts, setMyProducts] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const user = getUser();
    if (user) setSellerName(user.name);
    
    const fetchSellerData = async () => {
      try {
        const data = await getSellerProducts();
        setMyProducts(data);
      } catch (err) {
        // Handle error silently or show a toast in a real app
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchSellerData();
  }, [activeView]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await createProduct({
        name,
        description,
        price: Number(price),
        category,
        image
      });
      setSuccessMsg('Product listed successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage('');
      setMyProducts([]);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  const getSidebarClass = (item) => {
    const isActive = activeView === item;
    return `px-4 py-3 cursor-pointer font-medium rounded-lg transition-colors ${
      isActive 
        ? 'text-[#C9A96E] border-l-2 border-[#C9A96E] bg-[#1A1A1A] rounded-l-none' 
        : 'text-[#9A9A8A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]/50'
    }`;
  };

  const totalProducts = myProducts.length;
  const totalRevenue = myProducts.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN');

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex font-sans">
      <div className="w-64 bg-[#111111] border-r border-[#2A2A2A] min-h-[calc(100vh-73px)] p-8 hidden md:block">
        <h2 className="text-sm font-bold tracking-widest text-[#9A9A8A] uppercase mb-8">Seller Portal</h2>
        <ul className="space-y-3">
          <li onClick={() => setActiveView('dashboard')} className={getSidebarClass('dashboard')}>
            Dashboard
          </li>
          <li onClick={() => setActiveView('listItems')} className={getSidebarClass('listItems')}>
            List Items
          </li>
          <li onClick={() => setActiveView('orders')} className={getSidebarClass('orders')}>
            Orders
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col xl:flex-row gap-12 overflow-x-hidden">
        <div className="flex-1 w-full">
          {activeView === 'dashboard' && (
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#F5F5F0] mb-4">
                Overview
              </h1>
              <p className="text-[#9A9A8A] mb-12 border-b border-[#2A2A2A] pb-6 text-lg">
                Welcome back, <span className="text-[#F5F5F0]">{sellerName}</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl">
                  <h3 className="text-[#9A9A8A] text-sm uppercase tracking-wider mb-2">Products Listed</h3>
                  <p className="text-4xl font-bold text-[#F5F5F0]">{dashboardLoading ? '-' : totalProducts}</p>
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl">
                  <h3 className="text-[#9A9A8A] text-sm uppercase tracking-wider mb-2">Est. Revenue</h3>
                  <p className="text-4xl font-bold text-[#C9A96E]">{dashboardLoading ? '-' : `₹${totalRevenue}`}</p>
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl opacity-50">
                  <h3 className="text-[#9A9A8A] text-sm uppercase tracking-wider mb-2">Orders</h3>
                  <p className="text-xl font-bold text-[#F5F5F0] mt-2">-</p>
                </div>
              </div>

              <h2 className="text-2xl font-serif text-[#F5F5F0] mb-6">Your Listed Items</h2>
              {dashboardLoading ? (
                <p className="text-[#C9A96E] animate-pulse">Loading products...</p>
              ) : myProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map(product => (
                    <div key={product._id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 group">
                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden">
                          <h4 className="text-lg font-serif font-semibold text-[#F5F5F0] mb-1 group-hover:text-[#C9A96E] transition-colors truncate">{product.name}</h4>
                          <span className="text-xs font-bold tracking-wider uppercase text-[#C9A96E] bg-[#0F0F0F] px-2 py-1 rounded-full border border-[#2A2A2A] inline-block mt-2">
                            {product.category}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-[#F5F5F0] shrink-0 ml-4">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#9A9A8A] bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl">You haven't listed any products yet. Go to "List Items" to get started.</p>
              )}
            </div>
          )}

          {activeView === 'listItems' && (
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-serif text-[#F5F5F0] mb-4">
                List a New <span className="text-[#C9A96E]">Product</span>
              </h1>
              <p className="text-[#9A9A8A] mb-12 border-b border-[#2A2A2A] pb-6 text-lg">
                Add a new artisan piece to the marketplace.
              </p>
              
              <div className="bg-[#1A1A1A] p-8 md:p-10 rounded-3xl border border-[#2A2A2A] shadow-2xl">
                <form className="space-y-8" onSubmit={handleCreateProduct}>
                  <div>
                    <label className="block text-sm font-medium text-[#C9A96E] mb-3">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-lg" 
                      placeholder="E.g., Hand-painted Ceramic Mug" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#C9A96E] mb-3">Description</label>
                    <textarea 
                      rows="5" 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 resize-none text-lg leading-relaxed" 
                      placeholder="Describe your item's story, material, and dimensions..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-[#C9A96E] mb-3">Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-lg" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#C9A96E] mb-3">Category</label>
                      <select 
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors text-lg appearance-none" 
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Woodwork">Woodwork</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Painting">Painting</option>
                        <option value="Home Goods">Home Goods</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C9A96E] mb-3">Image</label>
                    <div className="flex flex-col gap-4">
                      <div className="relative border-2 border-dashed border-[#2A2A2A] rounded-2xl p-6 hover:border-[#C9A96E] transition-colors text-center cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <p className="text-[#9A9A8A]">
                          {image && image.startsWith('data:image') ? 'Image uploaded! Click to replace.' : 'Click to upload from gallery'}
                        </p>
                      </div>
                      
                      <div className="text-center text-[#9A9A8A] text-sm">OR enter an image URL</div>
                      <input 
                        type="text" 
                        value={image && !image.startsWith('data:image') ? image : ''}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-lg" 
                        placeholder="https://..." 
                      />
                    </div>
                  </div>

                  {successMsg && <div className="text-[#C9A96E] font-medium text-center text-lg">{successMsg}</div>}
                  {errorMsg && <div className="text-red-500 font-medium text-center text-lg">{errorMsg}</div>}

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-5 rounded-2xl font-bold text-[#0F0F0F] text-lg bg-[#C9A96E] hover:bg-[#d4b782] focus:outline-none transition-all transform hover:scale-[1.02] shadow-xl shadow-[#C9A96E]/20 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {loading ? 'Publishing...' : 'Publish Listing'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeView === 'orders' && (
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#F5F5F0] mb-4">
                Orders
              </h1>
              <p className="text-[#9A9A8A] mb-12 border-b border-[#2A2A2A] pb-6 text-lg">
                Manage your customer orders.
              </p>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-10 rounded-3xl text-center">
                <p className="text-xl text-[#C9A96E] font-medium">Coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
