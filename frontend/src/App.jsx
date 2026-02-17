import React, { useEffect, useState, useRef } from "react";

// ✅ Views
import LoopView from "./views/LoopView";
import PersonalizedView from "./views/PersonalizedView";
import InteractionView from "./views/InteractionView"; // Make sure this path matches your folder structure

export default function App() {
  // 1. Central State
  const [systemState, setSystemState] = useState({
    mode: "INTERACTION", // LOOP, PERSONALIZED, INTERACTION
    avatar_state: "LISTENING", // SLEEP, LISTENING, THINKING, SPEAKING
    subtitle: "Interaction View Test",
    ad: null,
  });

  // 2. Connection State (Changed to useState so UI re-renders on disconnect)
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    const WS_URL = "ws://localhost:8000/ws";

    const connectWS = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log("✅ Adorix Backend Connected");
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Debug: Log incoming messages to see if backend is sending what we expect
          // console.log("📩 WS Message:", data); 

          if (data.action === "MODE_SWITCH") {
            setSystemState((prev) => ({
              ...prev,
              mode: data.mode,
              ad: data.ad || prev.ad // Keep existing ad if backend doesn't send a new one
            }));
          }
          else if (data.action === "AVATAR_STATUS") {
            setSystemState((prev) => ({
              ...prev,
              avatar_state: data.status, // e.g., "LISTENING"
              subtitle: data.subtitle || "" // Update subtitle text
            }));
          }
          else if (data.action === "PLAY_AD") {
            setSystemState((prev) => ({ ...prev, ad: data.video }));
          }
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.current.onclose = () => {
        console.log("🔌 Disconnected. Retrying in 3s...");
        setIsConnected(false);
        setTimeout(connectWS, 3000);
      };

      ws.current.onerror = (err) => {
        console.error("WS Error:", err);
        ws.current.close();
      };
    };

    connectWS();
    return () => ws.current?.close();
  }, []);

  // ✅ Normalize ad path (Helper for PersonalizedView)
  const adSrc =
    typeof systemState.ad === "string"
      ? systemState.ad.startsWith("/")
        ? systemState.ad
        : `/${systemState.ad}`
      : null;

  // ✅ Handler to exit Interaction Mode manually
  const handleStopInteraction = () => {
    // 1. Optimistically switch back to Loop
    setSystemState(prev => ({ ...prev, mode: "LOOP", subtitle: "", avatar_state: "SLEEP" }));

    // 2. Tell backend to stop (if your backend supports this action)
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "STOP_INTERACTION" }));
    }
  };

  // ✅ Master State Machine: Route to views
  if (systemState.mode === "PERSONALIZED") {
    return (
      <PersonalizedView
        systemState={{ ...systemState, ad: adSrc }}
        isConnected={isConnected}
      />
    );
  }

  if (systemState.mode === "INTERACTION") {
    return (
      <InteractionView
        systemState={systemState}
        isConnected={isConnected}
        onStop={handleStopInteraction} // Pass the exit handler here
      />
    );
  }

  // Default View (LOOP)
  return <LoopView systemState={systemState} isConnected={isConnected} />;
}