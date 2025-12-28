const ChatWindow = ({ messages }) => {
  return (
    <div style={{ height: "70vh", overflowY: "auto", border: "1px solid #ccc" }}>
      {messages.map((m) => (
        <div key={m._id}>
          <b>{m.sender?.username}</b>:{" "}
          <span style={{ color: m.isToxic ? "red" : "black" }}>
            {m.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
