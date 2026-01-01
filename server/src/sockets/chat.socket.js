import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { checkToxic } from "../services/toxicCheck.service.js";

const onlineUsers = new Map(); // socketId -> username

const getPrivateRoom = (a, b) => `private:${[a, b].sort().join(":")}`;

const chatSocket = (io, socket) => {
  socket.on("join", ({ username, room }) => {
    if (!username) username = "anonymous";

    socket.data.username = username;
    socket.data.room = room || "global";
    socket.join(socket.data.room);

    onlineUsers.set(socket.id, username);

    // notify room
    io.to(room).emit("online-users", [...new Set(onlineUsers.values())]);

    socket.to(room).emit("system-message", {
      _id: `sys-${socket.id}-${Date.now()}`,
      text: `${username} joined the room`,
      system: true,
      createdAt: Date.now(),
    });
  });

  socket.on("join-private", ({ from, to }) => {
    const room = getPrivateRoom(from, to);
    socket.join(room);
  });

  // Typing indicator
  socket.on("typing", () => {
    if (!socket.data.room || !socket.data.username) return;

    socket.to(socket.data.room).emit("typing", {
      username: socket.data.username,
    });
  });

  // Receive message from frontend
  socket.on("send-message", async ({ text, tempId, to }) => {
    try {
      if (!text || !text.trim()) return;

      const username = socket.data.username || "anonymous";

      const room = to
        ? getPrivateRoom(username, to)
        : socket.data.room || "global";

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
        to,
        isPrivate: !!to,
        isToxic,
      });

      // Emit to room: include tempId to replace pending
      io.to(room).emit("new-message", {
        _id: msg._id.toString(), // MongoDB ID
        tempId, // frontend tempId
        sender: { username },
        text: msg.text,
        isToxic: msg.isToxic,
        isPrivate: !!to,
        to,
        status: "delivered",
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error("send-message error:", err.message);
      socket.emit("error", { message: "Message not sent" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);

    if (username && socket.data.room) {
      io.to(socket.data.room).emit(
        "online-users",
        Array.from(onlineUsers.values())
      );

      socket.to(socket.data.room).emit("system-message", {
        text: `${username} left the room`,
        createdAt: Date.now(),
      });
    }
  });
};

export default chatSocket;
