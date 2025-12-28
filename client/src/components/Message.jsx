export default function Message({ msg, currentUser }) {
  if (msg.system) {
    return (
      <div className="text-center text-gray-400 text-sm my-2">
        {msg.text}
      </div>
    );
  }

  const isMine = msg.sender?.username === currentUser.username;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-2 rounded-lg text-sm
          ${isMine ? "bg-blue-500 text-white" : "bg-gray-200"}
          ${msg.isToxic ? "border border-red-500" : ""}
        `}
      >
        {/* Sender name */}
        {!isMine && (
          <div className="text-xs font-semibold">
            {msg.sender?.username}
          </div>
        )}

        {/* Message text */}
        <div>{msg.text}</div>

        {/* Delivery tick */}
        {isMine && (
          <div className="text-xs opacity-70 mt-1">
            {msg.pending ? "⏳ sending…" : "✔✔ delivered"}
          </div>
        )}

        {/* Toxic warning */}
        {msg.isToxic && (
          <div className="text-red-500 text-xs mt-1">
            ⚠️ Flagged by AI
          </div>
        )}
      </div>
    </div>
  );
}
