import { useEffect, useState } from "react";
import MessageInput from "../components/MessageInput";
import { useSocket } from "../hooks/useSocket";

export default function ChatRoom({ user }) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (socket.hasJoined) return;
    socket.hasJoined = true;

    socket.emit("join", {
      username: user.username,
      room: "global",
    });

    socket.on("new-message", (msg) => {
      console.log("[UI] received new-message:", msg);

      setMessages((prev) => {
        const exists = prev.some((m) => m.tempId === msg.tempId);

        if (exists) {
          return prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, status: "delivered" } : m
          );
        }

        return [...prev, { ...msg, status: "delivered" }];
      });
    });

    socket.on("system-message", (msg) => {
      console.log("[UI] received system-message:", msg);
      setMessages((prev) => [...prev, { ...msg, system: true }]);
    });

    socket.on("typing", ({ username }) => {
      setTypingUser(username);

      clearTimeout(window._typingTimer);
      window._typingTimer = setTimeout(() => setTypingUser(null), 1500);
    });

    return () => {
      socket.off("new-message");
      socket.off("system-message");
      socket.off("typing");
    };
  }, [socketRef, user.username]);

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
              <small style={{ marginLeft: 6, opacity: 0.6 }}>
                {m.status === "sending" ? "✓" : "✓✓"}
              </small>
            </>
          )}
        </div>
      ))}

      {typingUser && (
        <div style={{ fontStyle: "italic", color: "gray", margin: "4px 0" }}>
          {typingUser} is typing...
        </div>
      )}

      <MessageInput
        socketRef={socketRef}
        onSend={(msg) => setMessages((prev) => [...prev, msg])}
      />
    </div>
  );
}
