import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import auth from "./middleware/auth.middleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*" })); // restrict in production
app.use(express.json());
app.use(morgan("dev"));

// base routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", auth, messageRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

export default app;
