import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, Clock, Flame, Check, Plus, Minus, Heart } from 'lucide-react';
import { MOCK_REVIEWS } from '../../data/mockData';

const FoodDetailsModal = ({ item, onClose }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedCusts, setSelectedCusts] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const itemPrice = item.discountPrice || item.price;
  const addonTotal = selectedCusts.reduce((sum, c) => sum + c.price, 0);
  const totalUnitPrice = itemPrice + addonTotal;
  const grandTotal = totalUnitPrice * quantity;

  const handleCustToggle = (cust) => {
    setSelectedCusts(prev => {
      const exists = prev.find(c => c.id === cust.id);
      if (exists) {
        return prev.filter(c => c.id !== cust.id);
      }
      return [...prev, cust];
    });
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedCusts, instructions);
    onClose();
  };

  const getSpiceLabel = (lvl) => {
    if (lvl === 1) return 'Mild Spiced';
    if (lvl === 2) return 'Medium Spiced';
    return 'Fiery Hot';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box Container */}
      <div className="relative w-full max-w-lg bg-bg-card rounded-modal overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col animate-scale-up border border-border-theme transition-colors duration-300">
        
        {/* Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/40 hover:bg-slate-950/60 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Favorite */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-950/40 hover:bg-slate-950/60 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <Heart size={16} fill={isFavorite ? '#FF6B00' : 'none'} stroke={isFavorite ? '#FF6B00' : 'white'} />
        </button>

        {/* Food Banner Image */}
        <div className="relative h-48 sm:h-56 flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 text-white text-left">
            <div className="flex items-center space-x-1.5 leading-none">
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                item.isVeg ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {item.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
              {item.isPopular && (
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-amber-500 text-slate-950 uppercase flex items-center space-x-1">
                  <Star size={8} fill="currentColor" />
                  <span>Best Seller</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold tracking-tight mt-1.5 text-white m-0 leading-tight drop-shadow-sm">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-border-theme flex-shrink-0 bg-bg-surface transition-colors duration-300">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'details' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-text-sub'
            }`}
          >
            Details
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'reviews' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-text-sub'
            }`}
          >
            Reviews ({item.reviewsCount})
          </button>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left no-scrollbar">
          
          {activeTab === 'details' ? (
            <>
              {/* Header metrics */}
              <div className="flex items-center justify-between bg-bg-surface border border-border-theme p-3 rounded-card transition-colors duration-300">
                <div className="flex items-center space-x-1 text-xs">
                  <Star size={14} fill="#FF6B00" stroke="#FF6B00" />
                  <span className="font-extrabold text-text-main">{item.rating}</span>
                  <span className="text-[10px] text-text-sub font-semibold">({item.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-[10.5px] font-bold text-text-sub">
                  <Clock size={12} />
                  <span>Prep: {item.prepTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-[10.5px] font-black text-primary uppercase tracking-wider">
                  <Flame size={12} />
                  <span>{getSpiceLabel(item.spiceLevel)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest">Description</h3>
                <p className="text-xs leading-relaxed text-text-sub font-semibold">
                  {item.description}
                </p>
              </div>

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest">Key Ingredients</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.map((ing, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] bg-bg-surface text-text-sub border border-border-theme px-2.5 py-1 rounded-xl font-bold transition-colors duration-300"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Customizations */}
              {item.customizations && item.customizations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest">Add Toppings</h3>
                  <div className="space-y-2">
                    {item.customizations.map((cust) => {
                      const isSelected = selectedCusts.some(c => c.id === cust.id);
                      return (
                        <div 
                          key={cust.id}
                          onClick={() => handleCustToggle(cust)}
                          className={`flex items-center justify-between p-3 rounded-card border text-xs cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-primary-bg border-primary text-primary' 
                              : 'bg-bg-card border-border-theme text-text-sub hover:bg-bg-surface'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-4 h-4 rounded-lg border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-primary border-primary text-white' : 'border-border-theme bg-bg-surface'
                            }`}>
                              {isSelected && <Check size={10} strokeWidth={4} />}
                            </div>
                            <span className="font-extrabold">{cust.name}</span>
                          </div>
                          <span className="font-bold text-primary font-mono">+₹{cust.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cooking notes */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest">Custom Notes</h3>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please make it moderately toasted, prepare without onions..."
                  className="w-full text-xs font-semibold p-3 bg-bg-surface border border-border-theme focus:border-primary focus:bg-bg-card rounded-[12px] outline-none min-h-[60px] resize-none transition-all focus:ring-2 focus:ring-primary/10 text-text-main"
                />
              </div>
            </>
          ) : (
            // Reviews View
            <div className="space-y-3.5">
              {MOCK_REVIEWS.map((rev) => (
                <div key={rev.id} className="p-3 bg-bg-surface rounded-card border border-border-theme text-xs space-y-1.5 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-primary-bg text-primary flex items-center justify-center font-black text-[10px] uppercase">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-text-main">{rev.name}</p>
                        <p className="text-[9px] text-text-muted font-bold">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          fill={i < rev.rating ? '#FF6B00' : 'none'} 
                          stroke={i < rev.rating ? '#FF6B00' : '#E5E7EB'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-sub font-semibold leading-relaxed m-0 text-left">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer controls: Add to cart */}
        <div className="border-t border-border-theme p-4 flex items-center justify-between bg-bg-surface flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center bg-bg-card border border-border-theme rounded-btn p-0.5 transition-colors duration-300">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-1.5 rounded-lg hover:bg-bg-surface text-text-sub transition-colors cursor-pointer"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="w-8 text-center text-xs font-black font-mono">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="p-1.5 rounded-lg hover:bg-bg-surface text-text-sub transition-colors cursor-pointer"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 ml-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-hover hover:to-primary-dark active:scale-95 text-white font-black py-3 px-4 rounded-btn shadow-sm shadow-primary/10 flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-all duration-200"
          >
            <span>Add to Cart</span>
            <span className="bg-white/25 px-2.5 py-0.5 rounded-lg font-black font-mono">
              ₹{grandTotal}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsModal;
