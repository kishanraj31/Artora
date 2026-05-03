// SellerDashboard — seller portal
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createProduct, getSellerProducts, updateProduct, deleteProduct } from '../services/productService';
import { getSellerOrders, updateOrderStatus } from '../services/orderService';
import { getUser } from '../utils/auth';

function SellerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeView = searchParams.get('view') || 'dashboard';

  const [sellerName, setSellerName] = useState('');
  
  const [myProducts, setMyProducts] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updateStatusMsg, setUpdateStatusMsg] = useState('');

  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
    
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await getSellerOrders();
        setOrders(data);
      } catch (err) {
        // Error handling
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchSellerData();
    if (activeView === 'orders' || activeView === 'dashboard') {
      fetchOrders();
    }
  }, [activeView]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrders = orders.map(o => 
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      );
      setOrders(updatedOrders);
      setUpdateStatusMsg('Updated!');
      setTimeout(() => setUpdateStatusMsg(''), 2000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const showSuccessPopup = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        image
      };

      if (editId) {
        await updateProduct(editId, productData);
        showSuccessPopup('Product Updated!');
      } else {
        await createProduct(productData);
        showSuccessPopup('Product Listed Successfully!');
      }
      
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage('');
      setEditId(null);
      
      // Refresh products list
      const updatedProducts = await getSellerProducts();
      setMyProducts(updatedProducts);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to process product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImage(product.image);
    navigate('/seller?view=listItems');
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteProduct(id);
      setMyProducts(myProducts.filter(p => p._id !== id));
      setDeleteConfirmId(null);
      showSuccessPopup('Product Deleted!');
    } catch (err) {
      alert('Failed to delete product');
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
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('en-IN');

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
    <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex font-sans">
      <div className="w-64 bg-[#111111] border-r border-[#2A2A2A] min-h-[calc(100vh-73px)] p-8 hidden md:block">
        <h2 className="text-sm font-bold tracking-widest text-[#9A9A8A] uppercase mb-8">Seller Portal</h2>
        <ul className="space-y-3">
          <li onClick={() => navigate('/seller?view=dashboard')} className={getSidebarClass('dashboard')}>
            Dashboard
          </li>
          <li onClick={() => {
            setEditId(null);
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage('');
            navigate('/seller?view=listItems');
          }} className={getSidebarClass('listItems')}>
            List Items
          </li>
          <li onClick={() => navigate('/seller?view=orders')} className={getSidebarClass('orders')}>
            Orders
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col xl:flex-row gap-12 overflow-x-hidden relative">
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
                  <h3 className="text-[#9A9A8A] text-sm uppercase tracking-wider mb-2">Orders Received</h3>
                  <p className="text-4xl font-bold text-[#F5F5F0]">{ordersLoading ? '-' : totalOrders}</p>
                </div>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl">
                  <h3 className="text-[#9A9A8A] text-sm uppercase tracking-wider mb-2">Est. Revenue</h3>
                  <p className="text-4xl font-bold text-[#C9A96E]">{ordersLoading ? '-' : `₹${totalRevenue}`}</p>
                </div>
              </div>

              <h2 className="text-2xl font-serif text-[#F5F5F0] mb-6">Your Listed Items</h2>
              {dashboardLoading ? (
                <p className="text-[#C9A96E] animate-pulse">Loading products...</p>
              ) : myProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map(product => (
                    <div key={product._id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 group flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
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

                      <div className="mt-4 border-t border-[#2A2A2A] pt-4 flex items-center justify-between">
                        {deleteConfirmId === product._id ? (
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-[#9A9A8A]">Delete this product?</span>
                            <button onClick={() => handleDeleteClick(product._id)} className="text-red-500 font-bold hover:underline">Yes</button>
                            <span className="text-[#444]">|</span>
                            <button onClick={() => setDeleteConfirmId(null)} className="text-[#F5F5F0] hover:underline">No</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => handleEditClick(product)} className="text-[#C9A96E] font-medium hover:underline transition-all">
                              Edit
                            </button>
                            <span className="text-[#444] font-bold">·</span>
                            <button onClick={() => setDeleteConfirmId(product._id)} className="text-[#9A9A8A] hover:underline transition-all">
                              Delete
                            </button>
                          </div>
                        )}
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
                {editId ? 'Edit Product' : <><span className="text-[#C9A96E]">List</span> a New Product</>}
              </h1>
              <p className="text-[#9A9A8A] mb-12 border-b border-[#2A2A2A] pb-6 text-lg">
                {editId ? 'Update the details of your listed item.' : 'Add a new artisan piece to the marketplace.'}
              </p>
              
              <div className="bg-[#1A1A1A] p-8 md:p-10 rounded-3xl border border-[#2A2A2A] shadow-2xl">
                <form className="space-y-8" onSubmit={handleSubmitProduct}>
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

                  {errorMsg && <div className="text-red-500 font-medium text-center text-lg">{errorMsg}</div>}

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-5 rounded-2xl font-bold text-[#0F0F0F] text-lg bg-[#C9A96E] hover:bg-[#d4b782] focus:outline-none transition-all transform hover:scale-[1.02] shadow-xl shadow-[#C9A96E]/20 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {loading ? 'Publishing...' : (editId ? 'Update Product' : 'Publish Listing')}
                    </button>
                    {editId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditId(null);
                          setName('');
                          setDescription('');
                          setPrice('');
                          setCategory('');
                          setImage('');
                        }}
                        className="w-full mt-4 py-3 rounded-2xl font-bold text-[#C9A96E] text-lg bg-transparent border border-[#C9A96E] hover:bg-[#C9A96E]/10 focus:outline-none transition-colors"
                      >
                        Cancel
                      </button>
                    )}
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
              <p className="text-[#9A9A8A] mb-12 border-b border-[#2A2A2A] pb-6 text-lg flex items-center justify-between">
                Manage your customer orders.
                {updateStatusMsg && <span className="text-green-400 font-medium text-sm bg-green-400/10 px-3 py-1 rounded-full">{updateStatusMsg}</span>}
              </p>
              
              {ordersLoading ? (
                <div className="text-[#C9A96E] text-xl font-medium animate-pulse">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-10 rounded-3xl text-center">
                  <p className="text-lg text-[#9A9A8A]">No orders yet. Keep listing great products!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order._id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <div className="flex-1">
                        <p className="text-sm text-[#9A9A8A] mb-1">Buyer: <span className="text-[#F5F5F0]">{order.buyerId?.name || 'Unknown'}</span></p>
                        <h3 className="text-xl font-serif text-[#C9A96E] mb-1">{order.product?.name || 'Product'} × {order.quantity}</h3>
                        <p className="text-sm text-[#9A9A8A] mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-block ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <div className="text-2xl font-bold text-[#F5F5F0]">
                          ₹{order.totalAmount}
                        </div>
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="w-full md:w-auto px-4 py-2 bg-[#0F0F0F] border border-[#C9A96E] text-[#C9A96E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A96E] transition-colors cursor-pointer"
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#C9A96E] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#C9A96E] flex items-center justify-center mb-6">
              <span className="text-[#C9A96E] text-2xl font-bold">✓</span>
            </div>
            <h3 className="text-2xl font-serif text-[#F5F5F0] mb-2">{popupMessage}</h3>
            <p className="text-[#9A9A8A] mb-8">Your item is now live on Artora.</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-[#C9A96E] text-[#0F0F0F] w-full py-3 rounded-xl font-bold hover:bg-[#d4b782] transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
