import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("[UI] initializing socket...");
    socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      autoConnect: true
    });

    socketRef.current.on("connect", () => {
      console.log("[UI] socket connected:", socketRef.current.id);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("[UI] socket connect_error:", err);
    });

    return () => {
      console.log("[UI] disconnecting socket...");
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef;
};
