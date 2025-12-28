import { useState } from "react";

export default function MessageInput({ socketRef, onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const socket = socketRef?.current;
    if (!socket) {
      console.warn("[UI] socket not ready in MessageInput");
      return;
    }
    if (!text.trim()) return;
    const tempId = crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();
    onSend({ tempId, text, status: "sending" });

    console.log("[UI] emitting send-message", { text, tempId });
    socket.emit("send-message", { text, tempId });
    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
    socketRef?.current?.emit("typing");
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
