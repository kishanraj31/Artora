// BuyerLayout — persistent sidebar wrapper for buyers
import { useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/auth';

function BuyerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isBuyer = isLoggedIn() && getUserRole() === 'buyer';

  // Determine active view based on path and query params
  const getActiveView = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const viewParam = searchParams.get('view');

    if (path === '/cart') return 'cart';
    if (path === '/orders') return 'orders';
    if (path === '/buyer' || path === '/buyer/') {
      if (viewParam === 'categories') return 'categories';
      if (viewParam === 'wishlist') return 'wishlist';
      return 'home';
    }
    return '';
  };

  const activeView = getActiveView();

  const handleSidebarClick = (item) => {
    if (item === 'home') navigate('/buyer');
    else if (item === 'categories') navigate('/buyer?view=categories');
    else if (item === 'wishlist') navigate('/buyer?view=wishlist');
    else if (item === 'cart') navigate('/cart');
    else if (item === 'orders') navigate('/orders');
  };

  const getSidebarClass = (item) => {
    const isActive = activeView === item;
    return `px-4 py-3 cursor-pointer font-medium rounded-lg transition-colors ${
      isActive 
        ? 'text-[#C9A96E] border-l-2 border-[#C9A96E] bg-[#1A1A1A] rounded-l-none' 
        : 'text-[#9A9A8A] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]/50'
    }`;
  };

  if (!isBuyer) {
    return <>{children}</>;
  }

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
          <li onClick={() => handleSidebarClick('wishlist')} className={getSidebarClass('wishlist')}>
            Wishlist
          </li>
          <li onClick={() => handleSidebarClick('cart')} className={getSidebarClass('cart')}>
            Cart
          </li>
          <li onClick={() => handleSidebarClick('orders')} className={getSidebarClass('orders')}>
            Orders
          </li>
        </ul>
      </div>
      <div className="flex-1 p-8 md:p-12 lg:p-16 relative">
        {children}
      </div>
    </div>
  );
}

export default BuyerLayout;
