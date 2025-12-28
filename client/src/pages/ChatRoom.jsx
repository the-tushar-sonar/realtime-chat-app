import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // fetch history
    api.get("/messages?room=global").then((res) => {
      setMessages(res.data.messages);
    });

    // socket connect
    socket.connect();
    socket.emit("join", { username: user.username, room: "global" });

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user.username]);

  const sendMessage = (text) => {
    socket.emit("send-message", { text });
  };

  return (
    <>
      <ChatWindow messages={messages} />
      <MessageInput onSend={sendMessage} />
    </>
  );
};

export default ChatRoom;
