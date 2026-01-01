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
    to: { type: String },
    isPrivate: { type: Boolean, default: false },
    isToxic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ isPrivate: 1, to: 1, createdAt: -1 }); // optional but recommended

export default mongoose.model("Message", messageSchema);
