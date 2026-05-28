import React from 'react';
import { Utensils } from 'lucide-react';

const SplashPage = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-tr from-primary to-accent flex flex-col items-center justify-center text-white px-6">
      {/* Visual glowing aura */}
      <div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center text-center space-y-6 animate-scale-up">
        {/* Animated Brand Emblem */}
        <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl animate-float">
          <Utensils size={44} strokeWidth={2.5} />
        </div>

        {/* Brand Typography */}
        <div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight m-0 drop-shadow-md">
            Kadak Bistro
          </h1>
          <p className="text-white/80 font-medium text-xs tracking-widest uppercase mt-2">
            Gourmet Dining Elevated
          </p>
        </div>

        {/* Dynamic Spinner */}
        <div className="flex flex-col items-center space-y-2 pt-6">
          <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <span className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">
            Loading Fresh Menu...
          </span>
        </div>
      </div>

      {/* Decorative footer elements */}
      <div className="absolute bottom-8 text-center text-white/50 text-[10px] font-bold tracking-wide">
        Powered by QR-Ordering Hub v4.0
      </div>
    </div>
  );
};

export default SplashPage;
