import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, Check, QrCode, Copy, ExternalLink, 
  Table2, ShieldCheck, Volume2, X 
} from 'lucide-react';


const SettingsPage = () => {
  const { settings, setSettings } = useApp();
  
  // Local form states
  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [gstNumber, setGstNumber] = useState(settings.gstNumber);
  const [gstRatePercent, setGstRatePercent] = useState(settings.gstRatePercent);
  const [serviceTaxPercent, setServiceTaxPercent] = useState(settings.serviceTaxPercent);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [timings, setTimings] = useState(settings.timings);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // QR Placard state
  const [selectedPlacardTable, setSelectedPlacardTable] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();

    setSettings(prev => ({
      ...prev,
      restaurantName,
      tagline,
      address,
      gstNumber,
      gstRatePercent: Number(gstRatePercent),
      serviceTaxPercent: Number(serviceTaxPercent),
      contactEmail,
      contactPhone,
      timings
    }));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const getTableLink = (tableNum) => {
    // Dynamically fetch window protocol and host to work both locally and in user custom deployments!
    const base = window.location.origin;
    return `${base}/?table=${tableNum}`;
  };

  const handleCopyLink = (tableNum) => {
    const link = getTableLink(tableNum);
    navigator.clipboard.writeText(link);
    alert(`Table ${tableNum} scan link successfully copied to clipboard: \n${link}`);
  };

  const handleLaunchSim = (tableNum) => {
    const link = getTableLink(tableNum);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border-theme pb-4">
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Bistro Settings & QR Hub
        </h2>
        <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
          Configure tax structures and manage tabletop QR allocations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Config Form */}
        <div className="lg:col-span-2 bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
          <h3 className="text-xs font-black uppercase text-text-muted tracking-wider mb-2 text-left">
            Restaurant Details Editor
          </h3>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-2xl border border-emerald-500/20 animate-scale-up">
              ✓ Administrative configuration values saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-text-sub text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Restaurant Name</label>
                <input 
                  type="text" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Brand Tagline</label>
                <input 
                  type="text" 
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Store Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">GSTIN Registration Number</label>
                <input 
                  type="text" 
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold font-mono uppercase focus-ring-orange text-text-main"
                />
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">GST Rate (%)</label>
                <input 
                  type="number" 
                  value={gstRatePercent}
                  onChange={(e) => setGstRatePercent(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Service Charge (%)</label>
                <input 
                  type="number" 
                  value={serviceTaxPercent}
                  onChange={(e) => setServiceTaxPercent(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Dining Hours</label>
                <input 
                  type="text" 
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                />
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Contact Phone</label>
                <input 
                  type="text" 
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                />
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wide text-[10px] text-text-muted">Contact Email</label>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-bg-surface border border-transparent focus:border-primary px-3 py-2.5 rounded-input outline-none font-bold focus-ring-orange text-text-main"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold py-3.5 rounded-btn transition-all shadow-md shadow-primary/20 uppercase tracking-wider flex items-center justify-center space-x-1"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Save Configuration</span>
            </button>
          </form>
        </div>

        {/* Right Column: QR Table Mapping Grid */}
        <div className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
          <div>
            <h3 className="text-xs font-black uppercase text-text-muted tracking-wider m-0 text-left">
              QR Table Allocations
            </h3>
            <p className="text-[10px] text-text-sub font-semibold mt-1 text-left">Tap a table cell to reveal and inspect its printable QR Placard mockup sheet.</p>
          </div>

          {/* Grid Tables */}
          <div className="grid grid-cols-2 gap-3 pb-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                onClick={() => setSelectedPlacardTable(num)}
                className="bg-bg-surface border border-border-theme p-3.5 rounded-2xl hover:border-primary hover:bg-primary-bg transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center space-y-2 group scale-100 hover:scale-[1.01]"
              >
                <div className="w-9 h-9 rounded-xl bg-bg-card text-text-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors border border-border-theme">
                  <Table2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-black text-text-main leading-none">Table {num}</p>
                  <p className="text-[8px] text-text-muted mt-1 font-mono tracking-tight leading-none truncate max-w-[80px]">?table={num}</p>
                </div>

                <div className="flex items-center space-x-1.5 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(num);
                    }}
                    className="p-1 rounded bg-bg-card hover:bg-bg-surface border border-border-theme text-text-sub"
                    title="Copy tabletop URL link"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchSim(num);
                    }}
                    className="p-1 rounded bg-bg-card hover:bg-bg-surface border border-border-theme text-text-sub"
                    title="Open tabletop in a new browser tab"
                  >
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Placard Mockup Sheet overlay modal */}
      {selectedPlacardTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedPlacardTable(null)}
          />

          <div className="relative w-full max-w-sm bg-bg-card rounded-modal p-6 shadow-2xl z-10 border border-border-theme animate-scale-up text-center flex flex-col items-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPlacardTable(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-bg-surface text-text-muted"
            >
              <X size={18} />
            </button>

            <span className="text-[9px] font-black tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
              Placard Mockup Sheet
            </span>

            {/* Placard Container */}
            <div className="my-6 p-6 bg-bg-surface border-4 border-border-theme rounded-modal w-full flex flex-col items-center space-y-4 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow shadow-primary/20">
                <Table2 size={24} />
              </div>
              
              <div>
                <h4 className="text-xl font-heading font-black text-text-main m-0">Table {selectedPlacardTable}</h4>
                <p className="text-[9px] text-text-muted font-extrabold uppercase tracking-wide mt-1">Scan to Order directly</p>
              </div>

              {/* Graphic QR */}
              <div className="w-36 h-36 bg-bg-card p-4 rounded-2xl flex flex-col justify-between border border-border-theme relative shadow shadow-slate-200/10 text-text-main">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-text-main rounded border-2 border-bg-card" />
                  <div className="w-8 h-8 bg-text-main rounded border-2 border-bg-card" />
                </div>
                <div className="text-[5px] text-text-muted font-mono tracking-wide leading-none select-all truncate max-w-[100px] mx-auto mt-1">
                  {getTableLink(selectedPlacardTable)}
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-text-main rounded border-2 border-bg-card" />
                  <div className="w-6 h-6 bg-primary rounded border border-bg-card" />
                </div>
              </div>

              <div className="text-[10px] text-text-muted leading-relaxed font-semibold max-w-[180px]">
                Ensure your table placemats align with the allocated QR code sheet.
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex space-x-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => handleCopyLink(selectedPlacardTable)}
                className="flex-1 py-3 border border-border-theme text-text-sub hover:bg-bg-surface rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                <Copy size={13} />
                <span>Copy URL</span>
              </button>
              <button
                onClick={() => handleLaunchSim(selectedPlacardTable)}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white rounded-btn transition-all shadow shadow-primary/15 cursor-pointer flex items-center justify-center space-x-1"
              >
                <ExternalLink size={13} />
                <span>Open Simulator</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
