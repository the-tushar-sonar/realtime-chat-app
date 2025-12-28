import { useEffect, useState } from "react";
import MessageInput from "../components/MessageInput";
import { useSocket } from "../hooks/useSocket";

export default function ChatRoom({ user }) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = socketRef.current;

    socket.emit("join", {
      username: user.username,
      room: "global",
    });

    socket.on("new-message", (msg) => {
      console.log("[UI] received new-message:", msg);

      setMessages((prev) => {
        const exists = prev.some((m) => m.tempId === msg.tempId);

        if (exists) {
          return prev.map((m) => (m.tempId === msg.tempId ? msg : m));
        }

        return [...prev, msg];
      });
    });

    socket.on("system-message", (msg) => {
      console.log("[UI] received system-message:", msg);
      setMessages((prev) => [...prev, { ...msg, system: true }]);
    });

    return () => {
      socket.off("new-message");
      socket.off("system-message");
    };
  }, []);

  return (
    <div>
      <h2>Global Chat</h2>

      {messages.map((m) => (
        <div
          key={m._id || m.tempId}
          style={
            m.system
              ? {
                  textAlign: "center",
                  color: "gray",
                  fontStyle: "italic",
                  margin: "8px 0",
                }
              : {}
          }
        >
          {m.system ? (
            <em>{m.text}</em>
          ) : (
            <>
              <span style={{ color: m.isToxic ? "red" : "white" }}>
                {m.text}
              </span>
              <small> ⏳ {m.status}</small>
            </>
          )}
        </div>
      ))}

      <MessageInput
        socketRef={socketRef}
        onSend={(msg) => setMessages((prev) => [...prev, msg])}
      />
    </div>
  );
}
