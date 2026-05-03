// Navbar — persistent top navigation
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, getUser, logout, getUserRole } from '../utils/auth';
import { getCartCount } from '../utils/cart';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedIn = isLoggedIn();
    const user = getUser();
    const role = getUserRole();
    const [cartCount, setCartCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (loggedIn && role === 'buyer') {
            setCartCount(getCartCount());
        }
    }, [loggedIn, location, role]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const renderDropdownLinks = () => {
        if (role === 'buyer') {
            return (
                <>
                    <Link to="/buyer?view=wishlist" className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors" onClick={() => setDropdownOpen(false)}>Wishlist</Link>
                    <Link to="/cart" className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors" onClick={() => setDropdownOpen(false)}>Cart</Link>
                    <Link to="/orders" className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors" onClick={() => setDropdownOpen(false)}>Orders</Link>
                </>
            );
        } else if (role === 'seller') {
            return (
                <>
                    <Link to="/seller?view=listItems" className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors" onClick={() => setDropdownOpen(false)}>List a Product</Link>
                    <Link to="/seller?view=dashboard" className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    <Link to="/seller?view=orders" className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors" onClick={() => setDropdownOpen(false)}>Orders</Link>
                </>
            );
        }
        return null;
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#0F0F0F] border-b border-[#2A2A2A] p-4 flex justify-between items-center transition-all duration-300">
            <div className="text-2xl font-bold tracking-widest text-[#C9A96E] uppercase font-serif">
                <Link to="/">ARTORA</Link>
            </div>
            <div className="flex gap-6 items-center">
                {!loggedIn ? (
                    <>
                        <Link to="/login" className="text-[#9A9A8A] hover:text-[#F5F5F0] transition-colors font-medium">Login</Link>
                        <Link to="/register" className="px-5 py-2 border border-[#C9A96E] text-[#C9A96E] rounded-full hover:bg-[#C9A96E] hover:text-[#0F0F0F] transition-colors font-medium">Sign Up</Link>
                    </>
                ) : (
                    <div className="flex items-center gap-6">
                        {role === 'buyer' && location.pathname !== '/' && (
                            <div
                                onClick={() => navigate('/cart')}
                                className="relative cursor-pointer hover:opacity-80 transition-opacity flex items-center"
                            >
                                <span className="text-2xl">🛒</span>
                                <span className="absolute -top-2 -right-2 bg-[#C9A96E] text-[#0F0F0F] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F0F0F]">
                                    {cartCount}
                                </span>
                            </div>
                        )}

                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border-2 border-[#C9A96E] flex items-center justify-center text-[#C9A96E] font-bold text-lg">
                                    {getInitial(user?.name)}
                                </div>
                                <span className="text-[#C9A96E] text-[10px] mt-1 font-medium max-w-[60px] truncate">{user?.name || 'User'}</span>
                            </div>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#C9A96E] rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                                    {renderDropdownLinks()}
                                    <div className="h-px bg-[#2A2A2A] my-2"></div>
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=kishanraj8601@gmail.com&su=Support-Artora"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block px-4 py-2 text-[#F5F5F0] hover:bg-[#2A2A2A] hover:text-[#C9A96E] transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Contact Us
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-[#EF4444] hover:bg-[#2A2A2A] transition-colors font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
