import { useNavigate, Link } from 'react-router-dom';

function ProductCard({ _id, name, price, image, category, currency = "₹" }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (_id) navigate(`/product/${_id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#C9A96E]/10 transition-all duration-300 transform hover:-translate-y-2 relative cursor-pointer"
    >
      <div className="h-64 overflow-hidden relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 pointer-events-none">
          <Link 
            to={`/product/${_id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#C9A96E] text-[#0F0F0F] px-8 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg pointer-events-auto hover:bg-[#d4b782] block"
          >
            View Details
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs bg-[#0F0F0F] text-[#C9A96E] px-3 py-1.5 rounded-full border border-[#2A2A2A] font-semibold tracking-wider uppercase">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-[#F5F5F0] mb-2 font-serif truncate pr-4">{name}</h3>
        <p className="text-2xl font-bold text-[#C9A96E]">{currency}{price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
