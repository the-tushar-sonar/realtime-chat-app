import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import chatSocket from "./sockets/chat.socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// attach io to app for route-level use if needed
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);
  chatSocket(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
