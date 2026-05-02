// Navbar — persistent top navigation
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUser, logout } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F0F] border-b border-[#2A2A2A] p-4 flex justify-between items-center transition-all duration-300">
      <div className="text-2xl font-bold tracking-widest text-[#C9A96E] uppercase font-serif">
        <Link to="/">ARTORA</Link>
      </div>
      <div className="flex gap-6 items-center">
        {loggedIn ? (
          <>
            <span className="text-[#9A9A8A] font-medium">Hello, {user?.name || 'My Account'}</span>
            <button onClick={handleLogout} className="text-[#9A9A8A] hover:text-[#F5F5F0] transition-colors font-medium">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-[#9A9A8A] hover:text-[#F5F5F0] transition-colors font-medium">Login</Link>
            <Link to="/register" className="text-[#9A9A8A] hover:text-[#F5F5F0] transition-colors font-medium">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
