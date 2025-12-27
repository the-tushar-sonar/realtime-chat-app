import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    displayName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
