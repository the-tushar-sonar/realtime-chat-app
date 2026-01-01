import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import chatSocket from "./sockets/chat.socket.js";
import dotenv from "dotenv";
import { verifyToken } from "./utils/jwt.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔐 Socket.IO JWT authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    socket.user = verifyToken(token);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id, socket.user?.username);
  chatSocket(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
