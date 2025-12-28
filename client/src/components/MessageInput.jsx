import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={submit}>Send</button>
    </div>
  );
};

export default MessageInput;
