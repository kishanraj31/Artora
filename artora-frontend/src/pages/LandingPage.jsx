// LandingPage — hero and introduction
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F0] flex flex-col font-sans">
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#C9A96E]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight relative z-10">
          Where Every Piece <br />
          <span className="text-[#C9A96E]">Tells a Story</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#9A9A8A] mb-12 max-w-3xl relative z-10">
          Discover handcrafted treasures directly from local artisans. No middlemen. Just art.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <Link 
            to="/buyer" 
            className="bg-[#C9A96E] text-[#0F0F0F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b782] transition-all transform hover:scale-105 shadow-lg shadow-[#C9A96E]/20"
          >
            Explore Marketplace
          </Link>
          <button 
            onClick={() => navigate('/register', { state: { defaultRole: 'seller' } })}
            className="border-2 border-[#C9A96E] text-[#C9A96E] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#C9A96E]/10 transition-all transform hover:scale-105"
          >
            Become a Seller
          </button>
        </div>
      </main>

      <section className="py-24 px-4 md:px-12 lg:px-24 bg-[#0F0F0F]">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-[#F5F5F0] mb-16">Why Artora?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#C9A96E]/50 hover:shadow-lg hover:shadow-[#C9A96E]/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-6">🤝</div>
            <h3 className="text-xl font-serif font-semibold text-[#F5F5F0] mb-3">Direct from Artisan</h3>
            <p className="text-[#9A9A8A] leading-relaxed">Connect directly with creators. No middlemen, ensuring fair compensation for real art.</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#C9A96E]/50 hover:shadow-lg hover:shadow-[#C9A96E]/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-6">✨</div>
            <h3 className="text-xl font-serif font-semibold text-[#F5F5F0] mb-3">Handpicked Quality</h3>
            <p className="text-[#9A9A8A] leading-relaxed">Curated selection of premium, handcrafted products that stand the test of time.</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#C9A96E]/50 hover:shadow-lg hover:shadow-[#C9A96E]/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-6">🌍</div>
            <h3 className="text-xl font-serif font-semibold text-[#F5F5F0] mb-3">Support Local Art</h3>
            <p className="text-[#9A9A8A] leading-relaxed">Empower your local community by supporting independent artists and small businesses.</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#0F0F0F] border-t border-[#2A2A2A] py-10 text-center mt-auto">
        <h2 className="text-2xl font-bold tracking-widest text-[#C9A96E] uppercase font-serif mb-3">ARTORA</h2>
        <p className="text-[#9A9A8A] text-sm">© 2026 Artora. The Marketplace for the Local Art and Artists.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
