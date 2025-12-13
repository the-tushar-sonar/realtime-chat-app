import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { checkToxic } from "../services/toxicCheck.service.js";

const chatSocket = (socket, io) => {
  // join a room
  socket.on("join", ({ username, room = "global" }) => {
    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;
    console.log(`${username} joined ${room}`);
    // notify others
    socket.to(room).emit("user-joined", { username });
  });

  // receive message
  socket.on("send-message", async ({ text }) => {
    try {
      const username = socket.data.username || "anonymous";
      const room = socket.data.room || "global";

      // optionally: find/create user
      let user = await User.findOne({ username });
      if (!user) user = await User.create({ username });

      // check toxicity (call service)
      const isToxic = await checkToxic(text);

      // persist message
      const msg = await Message.create({
        sender: user._id,
        text,
        room,
        isToxic
      });

      // emit to room
      io.to(room).emit("new-message", {
        _id: msg._id,
        sender: { _id: user._id, username: user.username },
        text: msg.text,
        isToxic: msg.isToxic,
        createdAt: msg.createdAt
      });

    } catch (err) {
      console.error("send-message error:", err.message);
      socket.emit("error", { message: "Message not sent" });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
};

export default chatSocket;
