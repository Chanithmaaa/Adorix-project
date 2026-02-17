import React from 'react';

const InteractionHUD = ({ state, subtitle }) => {
  // If no subtitle and not listening/thinking, maybe hide?
  // But for now let's just show it.

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="bg-black/60 backdrop-blur-xl px-10 py-6 rounded-3xl border border-white/10 max-w-3xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-white text-2xl md:text-3xl font-light leading-relaxed tracking-wide drop-shadow-lg">
          {subtitle || "Say 'Hey Adorix' to ask a question!"}
        </h2>
        {state && (
          <div className="mt-3 flex items-center justify-center gap-2 opacity-80">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-xs text-blue-200 uppercase tracking-[0.2em] font-medium">{state}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionHUD;