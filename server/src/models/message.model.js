import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    room: { type: String, default: "global", index: true },
    isToxic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
