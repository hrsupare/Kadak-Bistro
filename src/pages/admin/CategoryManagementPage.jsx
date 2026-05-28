import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, Edit, Trash2, ArrowUp, ArrowDown, 
  Layers, Check, X, Flame, Pizza, Sandwich, 
  Soup, IceCream, GlassWater, Utensils, Grid
} from 'lucide-react';

const CategoryManagementPage = () => {
  const { categories, addCategory, editCategory, deleteCategory, reorderCategories } = useApp();

  const [newCatName, setNewCatName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  // Map icon strings to Lucide components
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Flame': return <Flame size={16} />;
      case 'Pizza': return <Pizza size={16} />;
      case 'Sandwich': return <Sandwich size={16} />;
      case 'Soup': return <Soup size={16} />;
      case 'IceCream': return <IceCream size={16} />;
      case 'GlassWater': return <GlassWater size={16} />;
      default: return <Utensils size={16} />;
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory(newCatName.trim());
    setNewCatName('');
    setShowAddForm(false);
  };

  const handleEditStart = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;
    editCategory(editId, editName.trim());
    setEditId(null);
    setEditName('');
  };

  const handleDelete = (catId, catName) => {
    if (catId === 'all') {
      return alert("The default 'All Menu' category is a core system requirement and cannot be deleted.");
    }
    if (window.confirm(`Are you sure you want to delete category "${catName}"? This will hide dishes under this category.`)) {
      const res = deleteCategory(catId);
      if (!res.success) alert(res.error);
    }
  };

  // Reorder index swap controls
  const handleSwap = (index, delta) => {
    const newIdx = index + delta;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const list = [...categories];
    // Swap
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    reorderCategories(list);
  };

  return (
    <div className="space-y-6">
      
      {/* Header action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 border-b border-border-theme pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Menu Categories Desk
          </h2>
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
            Reorder horizontal categorizations and create new grids
          </p>
        </div>

        <button
          onClick={() => {
            setNewCatName('');
            setShowAddForm(true);
          }}
          className="bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs font-black px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center space-x-1 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Inline category creator card */}
      {showAddForm && (
        <section className="bg-bg-card rounded-card p-4 shadow-sm border border-primary/20 animate-slide-up text-left">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-black uppercase text-text-muted tracking-wider mb-2">Category Label Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Italian Pizzas, Refreshing Drinks..."
                className="w-full bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-4 py-2.5 rounded-input text-xs font-bold outline-none focus-ring-orange text-text-main"
                required
              />
            </div>
            <div className="flex items-end justify-end space-x-2 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 border border-border-theme text-text-sub rounded-xl hover:bg-bg-surface text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-btn text-xs font-black shadow shadow-primary/15 cursor-pointer flex items-center space-x-1"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>Save</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Grid of categories with manual move up/down */}
      <section className="bg-bg-card rounded-card shadow-sm border border-border-theme overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-bg-surface text-text-muted font-bold uppercase tracking-wider border-b border-border-theme">
                <th className="py-4 px-4 font-black">Category Label</th>
                <th className="py-4 px-4 font-black">Identifier Tag</th>
                <th className="py-4 px-4 font-black text-center">Swap Rankings</th>
                <th className="py-4 px-4 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme font-medium">
              {categories.map((cat, idx) => {
                const isEditing = editId === cat.id;

                return (
                  <tr key={cat.id} className="hover:bg-bg-surface/50 transition-colors">
                    {/* Visual details */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-bg-surface border border-primary px-3 py-1.5 rounded-lg text-xs font-bold outline-none text-text-main"
                            required
                          />
                          <button 
                            onClick={handleEditSave}
                            className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer"
                          >
                            <Check size={12} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => setEditId(null)}
                            className="p-1.5 rounded-lg border border-border-theme text-text-muted hover:bg-bg-surface"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-bg-surface text-text-sub flex items-center justify-center">
                            {cat.icon ? getIcon(cat.icon) : <Grid size={15} />}
                          </div>
                          <span className="font-extrabold text-text-main text-sm">
                            {cat.name}
                          </span>
                          {cat.id === 'all' && (
                            <span className="text-[8px] font-black uppercase tracking-wider bg-bg-surface text-text-sub px-1.5 py-0.5 rounded border border-border-theme">
                              Default
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* ID slug */}
                    <td className="py-3.5 px-4 font-mono text-text-muted text-[10px]">
                      {cat.id}
                    </td>

                    {/* swap rank controls */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleSwap(idx, -1)}
                          disabled={idx === 0}
                          className={`p-1 rounded-lg border transition-colors ${
                            idx === 0
                              ? 'border-border-theme text-text-muted opacity-30 cursor-not-allowed'
                              : 'border-border-theme hover:border-primary text-text-muted hover:text-primary cursor-pointer'
                          }`}
                          title="Move up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleSwap(idx, 1)}
                          disabled={idx === categories.length - 1}
                          className={`p-1 rounded-lg border transition-colors ${
                            idx === categories.length - 1
                              ? 'border-border-theme text-text-muted opacity-30 cursor-not-allowed'
                              : 'border-border-theme hover:border-primary text-text-muted hover:text-primary cursor-pointer'
                          }`}
                          title="Move down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </td>

                    {/* actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditStart(cat)}
                          className="p-1.5 rounded-lg border border-border-theme hover:border-primary text-text-sub hover:text-primary transition-colors"
                          title="Rename category"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={cat.id === 'all'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            cat.id === 'all'
                              ? 'border-border-theme text-text-muted opacity-30 cursor-not-allowed'
                              : 'border-border-theme hover:border-red-500 text-text-sub hover:text-red-500'
                          }`}
                          title="Delete category"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CategoryManagementPage;
