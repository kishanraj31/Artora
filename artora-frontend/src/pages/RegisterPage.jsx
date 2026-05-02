// RegisterPage — new user registration
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { register as registerService } from '../services/authService';

function RegisterPage() {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.defaultRole) {
      setRole(location.state.defaultRole);
    }
  }, [location.state]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerService(name, email, password, role);
      if (role === 'buyer') {
        navigate('/buyer');
      } else {
        navigate('/seller');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex flex-col justify-center py-6 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#1A1A1A] py-8 px-6 sm:px-10 rounded-3xl border border-[#2A2A2A] shadow-2xl shadow-black">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-widest text-[#C9A96E] uppercase font-serif mb-2">ARTORA</h2>
            <p className="text-[#9A9A8A] text-sm">Join the community of artisans and collectors.</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-medium text-[#9A9A8A] mb-1 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9A9A8A] mb-1 ml-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9A9A8A] mb-1 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-1">
              <label className="block text-xs font-medium text-[#9A9A8A] mb-2 ml-1">I want to...</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex-1 py-2 px-4 border-2 rounded-xl text-sm font-bold transition-all ${
                    role === 'buyer' 
                    ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]' 
                    : 'bg-[#0F0F0F] text-[#9A9A8A] border-[#2A2A2A] hover:border-[#9A9A8A]'
                  }`}
                >
                  Buy Art
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex-1 py-2 px-4 border-2 rounded-xl text-sm font-bold transition-all ${
                    role === 'seller' 
                    ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]' 
                    : 'bg-[#0F0F0F] text-[#9A9A8A] border-[#2A2A2A] hover:border-[#9A9A8A]'
                  }`}
                >
                  Sell Art
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-[#0F0F0F] bg-[#C9A96E] hover:bg-[#d4b782] focus:outline-none transition-all transform hover:scale-[1.02] shadow-lg shadow-[#C9A96E]/20 text-base disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
            
            {error && (
              <div className="mt-2 text-red-500 text-center font-medium text-xs">
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-[#2A2A2A] text-center">
            <p className="text-[#9A9A8A] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#C9A96E] hover:text-[#d4b782] transition-colors ml-1">
                Sign in
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
