import React from "react";
import AvatarOverlay from "../avatar/AvatarOverlay";
import InteractionHUD from "../components/InteractionHUD";
import LiveStatus from "../components/LiveStatus";

export default function InteractionView({ systemState, isConnected }) {
  const isListening = systemState.avatar_state === "LISTENING";
  const isThinking = systemState.avatar_state === "THINKING";

  return (
    <div className="relative w-screen h-screen bg-[#070b12] overflow-hidden flex flex-col items-center justify-center">

      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none
          ${isListening ? 'opacity-30 bg-blue-900/40' : ''}
          ${isThinking ? 'opacity-40 bg-purple-900/40' : ''}
          ${!isListening && !isThinking ? 'opacity-0' : ''}
        `}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] opacity-20" />
      </div>

      {!isConnected && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-md z-50 animate-pulse font-mono text-sm">
          CONNECTION LOST
        </div>
      )}

      <div className="absolute top-6 left-6 z-50">
        <LiveStatus isConnected={isConnected} />
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AvatarOverlay state={systemState.avatar_state} />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end pb-12">
        <InteractionHUD
          state={systemState.avatar_state}
          subtitle={systemState.subtitle}
        />
      </div>

    </div>
  );
}