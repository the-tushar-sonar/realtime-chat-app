import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { checkToxic } from "../services/toxicCheck.service.js";

const chatSocket = (socket, io) => {
  // Join a room
  socket.on("join", ({ username, room = "global" }) => {
    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    console.log(`${username} joined ${room}`);
    console.log("[SOCKET] join event from socket", socket.id, username, room);

    // Notify others
    socket.to(socket.data.room).emit("system-message", {
      text: `${socket.data.username} left`,
      createdAt: Date.now(),
    });
  });

  // Typing indicator
  socket.on("typing", () => {
    if (!socket.data.room || !socket.data.username) return;

    socket.to(socket.data.room).emit("typing", {
      username: socket.data.username,
    });
  });

  // Receive message from frontend
  socket.on("send-message", async ({ text, tempId }) => {
    try {
      if (!text || !text.trim()) return;

      const username = socket.data.username || "anonymous";
      const room = socket.data.room || "global";

      // Find or create user
      let user = await User.findOne({ username });
      if (!user) user = await User.create({ username });
      console.log("[SOCKET] send-message received", {
        socketId: socket.id,
        text,
        tempId,
      });

      // Check toxicity
      let isToxic = false;
      try {
        isToxic = await checkToxic(text);
      } catch {
        console.log("ML service down, skipping toxicity check");
      }

      // Persist message
      const msg = await Message.create({
        sender: user._id,
        text,
        room,
        isToxic,
      });

      // Emit to room: include tempId to replace pending
      io.to(room).emit("new-message", {
        _id: msg._id, // MongoDB ID
        tempId, // frontend tempId
        sender: { username },
        text: msg.text,
        isToxic: msg.isToxic,
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error("send-message error:", err.message);
      socket.emit("error", { message: "Message not sent" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
    const username = socket.data.username;
    const room = socket.data.room;

    if (username && room) {
      socket.to(room).emit("system-message", {
        text: `${username} left the room.`,
        createdAt: new Date(),
      });
    }
  });
};

export default chatSocket;
