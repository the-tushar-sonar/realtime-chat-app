import { useState } from "react";

export default function MessageInput({ socketRef, onSend, activeChat, user }) {
  const [text, setText] = useState("");
  if (!user || !user.username) return;

  const handleSend = () => {
    const socket = socketRef?.current;
    if (!socket || !text.trim()) return;

    const tempId = crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();

    // Optimistic UI update
    onSend({
      tempId,
      text,
      sender: { username: user.username },
      status: "sending",
      isPrivate: !!activeChat,
    });

    socket.emit("send-message", {
      text,
      tempId,
      to: activeChat && activeChat !== "global" ? activeChat : null,
    });

    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);

    // emit typing indicator (fire-and-forget)
    socketRef?.current?.emit("typing");
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={handleChange}
        placeholder={
          activeChat && activeChat !== "global"
            ? `Message ${activeChat}...`
            : "Type a message..."
        }
        className="flex-1 px-3 py-2 rounded bg-zinc-800 text-white outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
}
