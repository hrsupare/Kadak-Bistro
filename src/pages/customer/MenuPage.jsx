import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import FoodDetailsModal from '../../components/customer/FoodDetailsModal';
import { 
  Search, SlidersHorizontal, Flame, Pizza, Sandwich, Soup, 
  IceCream, GlassWater, Utensils, Star, Clock, Plus, Minus, Check, 
  ChevronRight, ShoppingBag, X, Grid, Heart 
} from 'lucide-react';

const MenuPage = () => {
  const { menu, categories, cart, addToCart, updateCartQuantity, settings, getCartTotal } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // all, veg, non-veg
  const [sortBy, setSortBy] = useState('popular');
  const [selectedItem, setSelectedItem] = useState(null);

  // Categories drawer overlay state (linked to ?showCats=true)
  const showCatsDrawer = searchParams.get('showCats') === 'true';

  const closeCategoriesDrawer = () => {
    searchParams.delete('showCats');
    setSearchParams(searchParams);
  };

  const handleSelectCategoryFromDrawer = (catId) => {
    setSelectedCategory(catId);
    closeCategoriesDrawer();
  };

  // Map icon strings to Lucide components
  const getIcon = (iconName, size = 15) => {
    switch (iconName) {
      case 'Flame': return <Flame size={size} />;
      case 'Pizza': return <Pizza size={size} />;
      case 'Sandwich': return <Sandwich size={size} />;
      case 'Soup': return <Soup size={size} />;
      case 'IceCream': return <IceCream size={size} />;
      case 'GlassWater': return <GlassWater size={size} />;
      default: return <Utensils size={size} />;
    }
  };

  // Filter & Sort Logic
  const filteredMenu = menu.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const dietMatch = dietFilter === 'all' || 
                      (dietFilter === 'veg' && item.isVeg) || 
                      (dietFilter === 'non-veg' && !item.isVeg);

    return categoryMatch && searchMatch && dietMatch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') {
      return (a.discountPrice || a.price) - (b.discountPrice || b.price);
    }
    if (sortBy === 'price-high') {
      return (b.discountPrice || b.price) - (a.discountPrice || a.price);
    }
    return b.rating - a.rating;
  });

  const getItemCartQty = (itemId) => {
    return cart
      .filter(c => c.id === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const getCartIndexForSimpleItem = (itemId) => {
    return cart.findIndex(c => c.id === itemId && c.customizations.length === 0);
  };

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    if (!item.inStock) return;
    
    if (item.customizations && item.customizations.length > 0) {
      setSelectedItem(item);
    } else {
      addToCart(item, 1, []);
    }
  };

  const handleCardQtyChange = (e, item, delta) => {
    e.stopPropagation();
    const cartIdx = getCartIndexForSimpleItem(item.id);
    if (cartIdx > -1) {
      updateCartQuantity(cartIdx, delta);
    } else if (delta > 0) {
      addToCart(item, 1, []);
    }
  };

  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = getCartTotal();

  return (
    <div className="space-y-6">
      
      {/* Premium Food App Brand Banner Card - Clean Light layout */}
      <section className="relative rounded-modal overflow-hidden shadow-sm border border-border-theme transition-all duration-300">
        <div className="h-32 sm:h-36 relative">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
            alt="Bistro Banner"
            className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.02]"
          />
          {/* Brighter white-transparent overlay for premium light-theme visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] uppercase font-black tracking-widest bg-primary text-white px-2 py-0.5 rounded-lg shadow-sm shadow-primary/20">
                Dine-In Table
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest bg-white/20 backdrop-blur-sm text-slate-100 px-2 py-0.5 rounded-lg border border-white/10 font-mono">
                🕒 {settings.timings}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-1 m-0 p-0 leading-none drop-shadow">
              {settings.restaurantName}
            </h2>
            <p className="text-[10px] text-slate-200 font-bold m-0 mt-1 leading-none tracking-wide drop-shadow-sm">
              {settings.tagline}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 text-center flex flex-col items-center shadow shadow-slate-900/5">
            <span className="text-xs font-black text-amber-400">4.9★</span>
            <span className="text-[7px] text-slate-200 uppercase font-black tracking-widest mt-0.5 font-sans">Reviews</span>
          </div>
        </div>
      </section>

      {/* Brighter search panel and filters strip - fully semantic */}
      <section className="bg-bg-card rounded-modal p-4 shadow-sm border border-border-theme space-y-3.5 transition-colors duration-300">
        <div className="flex space-x-2">
          {/* Search bar input container */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-sub">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, starters..."
              className="w-full bg-bg-surface border border-border-theme focus:border-primary px-4 py-2.5 pl-10 rounded-xl text-xs sm:text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-primary/10 text-text-main"
            />
          </div>
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-bg-surface border border-border-theme hover:border-slate-300 dark:hover:border-slate-700 px-3.5 py-2.5 pr-8 rounded-xl text-xs font-black outline-none cursor-pointer text-text-sub transition-colors"
            >
              <option value="popular">⭐ Popular</option>
              <option value="price-low">₹ Price: Low-High</option>
              <option value="price-high">₹ Price: High-Low</option>
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[8px]">
              ▼
            </span>
          </div>
        </div>

        {/* Veg/Non-Veg filter strip */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setDietFilter('all')}
            className={`px-3.5 py-2 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              dietFilter === 'all'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow shadow-primary/15 scale-105'
                : 'bg-bg-surface text-text-sub hover:bg-slate-200 border border-border-theme'
            }`}
          >
            All Menu
          </button>
          
          <button
            onClick={() => setDietFilter('veg')}
            className={`px-3.5 py-2 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center space-x-2 ${
              dietFilter === 'veg'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:bg-emerald-500/20'
                : 'bg-bg-surface border-border-theme text-text-sub hover:bg-slate-200'
            }`}
          >
            <span className="w-3 h-3 rounded border border-emerald-600 dark:border-emerald-400 flex items-center justify-center p-0.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            </span>
            <span>Veg Only</span>
          </button>

          <button
            onClick={() => setDietFilter('non-veg')}
            className={`px-3.5 py-2 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center space-x-2 ${
              dietFilter === 'non-veg'
                ? 'bg-red-500/10 border-red-500/30 text-red-500 dark:bg-red-500/20'
                : 'bg-bg-surface border-border-theme text-text-sub hover:bg-slate-200'
            }`}
          >
            <span className="w-3 h-3 rounded border border-red-500 flex items-center justify-center p-0.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            </span>
            <span>Non-Veg</span>
          </button>
        </div>
      </section>

      {/* Horizontal categories strip - clean white backgrounds */}
      <section className="space-y-2.5">
        <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest text-left">
          Food Categories
        </h3>
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-none no-scrollbar snap-x">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`snap-start flex-shrink-0 flex items-center space-x-2 px-4.5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white border-primary shadow shadow-primary/15 scale-105'
                    : 'bg-bg-card text-text-sub border-border-theme hover:bg-bg-surface shadow-sm'
                }`}
              >
                {cat.icon && getIcon(cat.icon, 13)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Product cards grid - completely overhauled */}
      <section className="space-y-4 pb-32">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest text-left">
            Appetizing Dishes ({filteredMenu.length})
          </h3>
        </div>

        {filteredMenu.length === 0 ? (
          <div className="bg-bg-card rounded-card p-16 text-center text-text-sub border border-border-theme shadow-sm transition-colors duration-300">
            <SlidersHorizontal className="mx-auto mb-3 text-primary animate-float" size={28} strokeWidth={1.5} />
            <p className="text-sm font-semibold">No food matches found.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDietFilter('all');
              }}
              className="text-xs font-black text-primary mt-2 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMenu.map((item) => {
              const cartQty = getItemCartQty(item.id);
              const isSimpleItem = !item.customizations || item.customizations.length === 0;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-in-out relative overflow-hidden group"
                >
                  <div className="flex space-x-3.5">
                    {/* Visual food thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center text-center p-2 text-white font-heading font-extrabold text-[9px] uppercase tracking-wider">
                          Out of Stock
                        </div>
                      )}
                      {/* Floating prep time */}
                      <div className="absolute bottom-1 right-1 bg-slate-950/60 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center space-x-0.5 font-mono">
                        <Clock size={8} />
                        <span>{item.prepTime}</span>
                      </div>
                    </div>

                    {/* Food text description */}
                    <div className="flex-1 space-y-1 py-0.5 text-left truncate">
                      <div className="flex items-center space-x-1.5 leading-none">
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center p-0.5 flex-shrink-0 ${
                          item.isVeg ? 'border-emerald-600 dark:border-emerald-400' : 'border-red-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-red-500'
                          }`} />
                        </span>
                        
                        {item.isPopular && (
                          <span className="text-[7.5px] font-black uppercase text-amber-500 tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-500/20 font-sans leading-none">
                            Best Seller
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-heading font-extrabold tracking-tight text-text-main group-hover:text-primary transition-colors leading-tight truncate">
                        {item.name}
                      </h4>

                      <p className="text-[10px] sm:text-xs text-text-sub leading-relaxed line-clamp-2 font-semibold">
                        {item.description}
                      </p>

                      <div className="flex items-center space-x-1 text-[10px] sm:text-xs font-bold text-amber-500 pt-0.5 leading-none">
                        <Star size={10} fill="currentColor" />
                        <span>{item.rating}</span>
                        <span className="text-text-muted font-medium">({item.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action controllers */}
                  <div className="mt-4 pt-3.5 border-t border-border-theme flex items-center justify-between flex-shrink-0">
                    <div className="flex items-baseline space-x-1.5">
                      {item.discountPrice ? (
                        <>
                          <span className="text-base font-heading font-extrabold text-primary font-mono">
                            ₹{item.discountPrice}
                          </span>
                          <span className="text-[10px] text-text-muted font-bold line-through font-mono">
                            ₹{item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-heading font-extrabold text-text-main font-mono">
                          ₹{item.price}
                        </span>
                      )}
                    </div>

                    {/* Quantity selectors */}
                    <div>
                      {cartQty > 0 && isSimpleItem ? (
                        <div 
                          className="flex items-center bg-primary text-white rounded-full p-0.5 shadow-sm shadow-primary/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleCardQtyChange(e, item, -1)}
                            className="p-1.5 rounded-full hover:bg-primary-hover transition-colors cursor-pointer"
                          >
                            <Minus size={9} strokeWidth={3.5} />
                          </button>
                          <span className="w-5.5 text-center text-xs font-black font-mono leading-none">{cartQty}</span>
                          <button
                            onClick={(e) => handleCardQtyChange(e, item, 1)}
                            className="p-1.5 rounded-full hover:bg-primary-hover transition-colors cursor-pointer"
                          >
                            <Plus size={9} strokeWidth={3.5} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleQuickAdd(e, item)}
                          disabled={!item.inStock}
                          className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full transition-all shadow-sm flex items-center space-x-0.5 border cursor-pointer ${
                            item.inStock
                              ? 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-hover hover:to-primary-dark border-transparent text-white shadow-sm shadow-primary/10'
                              : 'bg-bg-surface text-text-muted border-border-theme cursor-not-allowed shadow-none'
                          }`}
                        >
                          <span>ADD</span>
                          {!isSimpleItem && item.inStock && (
                            <span className="text-[8px] text-white font-black ml-0.5 leading-none">
                              +
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* STICKY BOTTOM MOBILE CART CHECKOUT SUMMARY OVERLAY - Clean White Zomato layout */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-18 left-3 right-3 sm:max-w-xl sm:mx-auto z-40 animate-slide-up">
          <div 
            onClick={() => navigate('/cart')}
            className="w-full bg-bg-card/95 backdrop-blur-xl border border-border-theme py-3 px-4 rounded-card shadow-lg shadow-black/5 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-3 text-left leading-none">
              <div className="w-8 h-8 bg-primary-bg dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <ShoppingBag size={15} />
              </div>
              <div>
                <p className="text-[9.5px] font-black text-text-sub uppercase tracking-wider m-0">{cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'} Added</p>
                <p className="font-heading font-black m-0 mt-1 text-sm text-primary font-mono">₹{cartTotal}</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gradient-to-r from-primary to-primary-light hover:from-primary-hover hover:to-primary-dark text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow shadow-primary/10 group-hover:scale-105 duration-300 space-x-1">
              <span>Checkout Selection</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Overlay Modal Dialog */}
      {selectedItem && (
        <FoodDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* CATEGORIES DRAWER MODAL OVERLAY (Triggered via url showCats=true) */}
      {showCatsDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
            onClick={closeCategoriesDrawer}
          />
          
          <div className="relative w-full max-w-md bg-bg-card rounded-t-[24px] overflow-hidden shadow-2xl z-10 max-h-[70vh] flex flex-col animate-slide-up border-t border-border-theme">
            <div className="flex items-center justify-between p-4 border-b border-border-theme flex-shrink-0">
              <div className="flex items-center space-x-2 text-primary">
                <Grid size={17} />
                <h3 className="font-heading font-extrabold text-sm sm:text-base m-0 text-text-main">
                  Select Category
                </h3>
              </div>
              <button 
                onClick={closeCategoriesDrawer}
                className="p-1 rounded-lg hover:bg-bg-surface text-text-muted hover:text-text-sub transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* List category items */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 pb-8 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategoryFromDrawer(cat.id)}
                    className={`p-4 rounded-card border text-xs flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                      isSelected
                        ? 'bg-primary-bg border-primary/25 text-primary'
                        : 'bg-bg-surface border-border-theme text-text-sub hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white shadow shadow-primary/20' : 'bg-bg-card text-text-sub border border-border-theme'
                    }`}>
                      {cat.icon ? getIcon(cat.icon, 16) : <Grid size={16} />}
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-wider">{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
