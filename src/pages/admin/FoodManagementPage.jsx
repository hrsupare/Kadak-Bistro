import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, Edit, Trash2, Search, SlidersHorizontal, 
  Utensils, Check, X, ShieldAlert, Sparkles, AlertCircle 
} from 'lucide-react';

const FoodManagementPage = () => {
  const { menu, categories, addMenuItem, editMenuItem, deleteMenuItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null means adding new item

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [prepTime, setPrepTime] = useState('10-12 mins');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [inStock, setInStock] = useState(true);

  // Filters
  const filteredInventory = menu.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const resetForm = () => {
    setEditId(null);
    setName('');
    setPrice('');
    setDiscountPrice('');
    setDescription('');
    setCategory(categories[1]?.id || 'starters'); // Default to first custom category
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600');
    setIsVeg(true);
    setPrepTime('12-15 mins');
    setIngredientsInput('');
    setInStock(true);
  };

  const handleOpenAdd = () => {
    resetForm();
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price);
    setDiscountPrice(item.discountPrice || '');
    setDescription(item.description);
    setCategory(item.category);
    setImage(item.image);
    setIsVeg(item.isVeg);
    setPrepTime(item.prepTime);
    setIngredientsInput(item.ingredients ? item.ingredients.join(', ') : '');
    setInStock(item.inStock);
    setDrawerOpen(true);
  };

  const handleDelete = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      deleteMenuItem(itemId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Dish name is required.");
    if (!price || Number(price) <= 0) return alert("Please specify a valid price.");
    if (discountPrice && Number(discountPrice) >= Number(price)) {
      return alert("Discount price must be less than regular price!");
    }

    const ingredients = ingredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i !== '');

    const itemData = {
      name: name.trim(),
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      description: description.trim(),
      category,
      image: image.trim(),
      isVeg,
      prepTime: prepTime.trim(),
      ingredients,
      inStock
    };

    if (editId) {
      editMenuItem(editId, itemData);
    } else {
      addMenuItem(itemData);
    }

    setDrawerOpen(false);
  };

  const handleStockToggle = (itemId, currentStock) => {
    editMenuItem(itemId, { inStock: !currentStock });
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header action banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 border-b border-border-theme pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dish Catalog Management
          </h2>
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
            Audit store catalog and configure pricing
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs font-black px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center space-x-1 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Audit Search bar and filters */}
      <section className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, description..."
            className="w-full bg-bg-card border border-border-theme focus:border-primary px-4 py-2.5 pl-10 rounded-2xl text-xs sm:text-sm font-semibold outline-none transition-all shadow-sm focus-ring-orange text-text-main"
          />
        </div>

        <div className="flex space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-bg-card border border-border-theme hover:border-primary px-4 py-2.5 pr-10 rounded-2xl text-xs font-bold outline-none cursor-pointer text-text-sub shadow-sm focus-ring-orange"
          >
            <option value="all">📁 All Categories</option>
            {categories.filter(c => c.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Catalog lists Table */}
      <section className="bg-bg-card rounded-card shadow-sm border border-border-theme overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-bg-surface text-text-muted font-bold uppercase tracking-wider border-b border-border-theme">
                <th className="py-4 px-4 font-black">Dish details</th>
                <th className="py-4 px-4 font-black">Category</th>
                <th className="py-4 px-4 font-black">Regular price</th>
                <th className="py-4 px-4 font-black">Sale price</th>
                <th className="py-4 px-4 font-black text-center">Stock status</th>
                <th className="py-4 px-4 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme font-medium">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-text-muted">
                    <Utensils className="mx-auto mb-2 text-text-muted" size={28} />
                    <p className="font-semibold text-xs">No foods available matching filters.</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-surface/50 transition-colors">
                    {/* Visual details */}
                    <td className="py-3.5 px-4 flex items-center space-x-3.5 text-left">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-sm text-text-main leading-tight">
                          {item.name}
                        </p>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          item.isVeg ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>
                    </td>

                    {/* Category tag */}
                    <td className="py-3.5 px-4 font-bold text-text-sub capitalize text-left">
                      {item.category}
                    </td>

                    {/* Reg price */}
                    <td className="py-3.5 px-4 font-extrabold text-text-main text-left font-mono">
                      ₹{item.price}
                    </td>

                    {/* Discount price */}
                    <td className="py-3.5 px-4 font-extrabold text-primary text-left font-mono">
                      {item.discountPrice ? `₹${item.discountPrice}` : '—'}
                    </td>

                    {/* Stock switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleStockToggle(item.id, item.inStock)}
                        className={`mx-auto flex items-center justify-between px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-colors ${
                          item.inStock
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                            : 'bg-red-500/10 border-red-500/30 text-red-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg border border-border-theme hover:border-primary text-text-sub hover:text-primary transition-colors"
                          title="Edit dish details"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg border border-border-theme hover:border-red-500 text-text-sub hover:text-red-500 transition-colors"
                          title="Delete dish"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual form slider panel drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-bg-card shadow-2xl h-full flex flex-col p-6 animate-slide-up no-scrollbar overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-theme pb-3.5 mb-5 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="font-heading font-extrabold text-base m-0 text-text-main">
                  {editId ? 'Modify Dish Entry' : 'Create New Menu Item'}
                </h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-bg-surface text-text-muted"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-text-sub text-left">
              
              {/* Dish Name */}
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Dish Title</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Golden Garlic Bread"
                  className="w-full bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-4 py-2.5 rounded-input text-xs outline-none transition-all font-bold focus-ring-orange text-text-main"
                  required
                />
              </div>

              {/* Category & Veg/Non-Veg */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input text-xs font-bold outline-none text-text-main focus-ring-orange"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Diet type</label>
                  <select 
                    value={isVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setIsVeg(e.target.value === 'veg')}
                    className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input text-xs font-bold outline-none text-text-main focus-ring-orange"
                  >
                    <option value="veg">🟢 Veg Only</option>
                    <option value="nonveg">🔴 Non-Veg</option>
                  </select>
                </div>
              </div>

              {/* Regular and Discount Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Regular Price (₹)</label>
                  <input 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Regular ₹"
                    className="w-full bg-bg-surface border border-transparent focus:border-primary px-4 py-2.5 rounded-input text-xs outline-none transition-all font-bold focus-ring-orange text-text-main"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Discount Price (₹)</label>
                  <input 
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Discounted (Optional)"
                    className="w-full bg-bg-surface border border-transparent focus:border-primary px-4 py-2.5 rounded-input text-xs outline-none transition-all font-bold focus-ring-orange text-text-main"
                  />
                </div>
              </div>

              {/* Prep time & Image URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Prep Time</label>
                  <input 
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 10-12 mins"
                    className="w-full bg-bg-surface border border-transparent focus:border-primary px-4 py-2.5 rounded-input text-xs outline-none transition-all font-bold focus-ring-orange text-text-main"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer w-full bg-bg-surface p-2.5 rounded-input border border-transparent hover:border-primary transition-colors text-text-main">
                    <input 
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-800 cursor-pointer"
                    />
                    <span className="font-bold text-xs">Set as Available</span>
                  </label>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">High-Res Image URL</label>
                <input 
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-4 py-2.5 rounded-input text-xs outline-none font-mono font-bold truncate focus-ring-orange text-text-main"
                />
              </div>

              {/* Ingredients input */}
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Dishes Ingredients (comma-separated)</label>
                <input 
                  type="text"
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  placeholder="e.g. Mozzarella, San Marzano, Fresh Basil..."
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-4 py-2.5 rounded-input text-xs outline-none transition-all font-bold focus-ring-orange text-text-main"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-bold mb-2">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an appetizing marketing detail..."
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-4 py-2.5 rounded-input text-xs outline-none min-h-[70px] resize-none transition-all font-bold focus-ring-orange text-text-main"
                  required
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold py-3.5 rounded-btn transition-all shadow-md shadow-primary/20 uppercase text-xs tracking-wider flex items-center justify-center space-x-1"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>{editId ? 'Modify Dish' : 'Publish Dish'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagementPage;
