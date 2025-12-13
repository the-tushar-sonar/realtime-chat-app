import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// Create or get user by username
router.post("/login", async (req, res) => {
  const { username, displayName } = req.body;
  if (!username) return res.status(400).json({ error: "username required" });

  try {
    let user = await User.findOne({ username });
    if (!user) user = await User.create({ username, displayName });

    res.json({ ok: true, user: { _id: user._id, username: user.username, displayName: user.displayName } });
  } catch (err) {
    console.error("auth/login err:", err.message);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
