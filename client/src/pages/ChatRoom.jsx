import { useEffect, useState } from "react";
import MessageInput from "../components/MessageInput";
import { useSocket } from "../hooks/useSocket";

export default function ChatRoom({ user }) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeChat, setActiveChat] = useState("global");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (socket.hasJoined) return;
    socket.hasJoined = true;

    socket.emit("join", {
      room: "global",
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("new-message", (msg) => {
      console.log("[UI] received new-message:", msg);

      setMessages((prev) => {
        const exists = prev.some((m) => m.tempId === msg.tempId);

        if (exists) {
          return prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, status: "sent" } : m
          );
        }

        return [...prev, { ...msg, status: "sent" }];
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
      socket.off("online-users");
    };
  }, [socketRef, user.username]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (activeChat) {
      socket.emit("join-private", {
        from: user.username,
        to: activeChat,
      });
    }
  }, [activeChat, socketRef, user.username]);

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-2">
        {activeChat ? `Chat with ${activeChat}` : "🌍 Global Chat"}
      </h2>

      {/* Online users */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-3">
        <strong>Online:</strong>{" "}
        {onlineUsers
          .filter((u, i, arr) => arr.indexOf(u) === i)
          .filter((u) => u !== user.username)
          .map((u, index) => (
            <span
              key={`online-${u}-${index}`}
              onClick={() => setActiveChat(u)}
              className={`ml-2 cursor-pointer ${
                activeChat === u ? "font-bold text-green-400" : ""
              }`}
            >
              🟢 {u}
            </span>
          ))}
        {activeChat && (
          <button
            onClick={() => setActiveChat(null)}
            style={{ marginLeft: "10px" }}
          >
            Back to Global
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m._id ?? `temp-${m.tempId}`}
            className={`my-2 ${
              m.system ? "text-center text-gray-400 italic text-sm" : ""
            }`}
          >
            {m.system ? (
              <div className="my-2">{m.text}</div>
            ) : (
              <div className="flex items-end gap-2">
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    m.isToxic
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <span className="font-semibold mr-1">
                    {m.sender?.username}:
                  </span>
                  {m.text}
                </div>

                <small className="text-gray-400 text-xs">
                  {m.status === "sending" ? "✓" : "✓✓"}
                </small>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="text-sm italic text-gray-400 mb-2">
          {typingUser} is typing...
        </div>
      )}

      {/* Message input */}
      <MessageInput
        socketRef={socketRef}
        user={user}
        activeChat={activeChat}
        onSend={(msg) => setMessages((prev) => [...prev, msg])}
      />
    </div>
  );
}
