import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  room: { type: String, default: "global" },
  isToxic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
