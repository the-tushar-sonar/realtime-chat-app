import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const fetchMessages = async (req, res) => {
  const { room = "global", limit } = req.query;
  const safeLimit = Math.min(parseInt(limit) || 50, 100);

  try {
    // populate sender info
    const msgs = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .populate("sender", "username displayName")
      .lean();

    res.json({ ok: true, messages: msgs.reverse() }); // reverse so oldest-first
  } catch (err) {
    console.error("fetchMessages err:", err.message);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};
