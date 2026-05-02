// LoginPage — user authentication
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { getUserRole } from '../utils/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginService(email, password);
      const role = getUserRole();
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
    <div className="min-h-[calc(100vh-73px)] bg-[#0F0F0F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#1A1A1A] py-12 px-8 sm:px-12 rounded-3xl border border-[#2A2A2A] shadow-2xl shadow-black">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-widest text-[#C9A96E] uppercase font-serif mb-3">ARTORA</h2>
            <p className="text-[#9A9A8A] text-lg">Welcome back to the marketplace.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-[#9A9A8A] mb-2 ml-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-lg"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9A9A8A] mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl text-[#F5F5F0] focus:outline-none focus:border-[#C9A96E] transition-colors placeholder-[#9A9A8A]/30 text-lg"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-[#0F0F0F] bg-[#C9A96E] hover:bg-[#d4b782] focus:outline-none transition-all transform hover:scale-[1.02] shadow-lg shadow-[#C9A96E]/20 text-lg disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 text-red-500 text-center font-medium text-sm">
                {error}
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-[#2A2A2A] text-center">
            <p className="text-[#9A9A8A] text-md">
              New to Artora?{' '}
              <Link to="/register" className="font-semibold text-[#C9A96E] hover:text-[#d4b782] transition-colors ml-2">
                Create an account
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
