import mongoose, { Schema } from "mongoose";

export const LikeSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  post: { type: mongoose.Types.ObjectId, ref: "Post" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const Like = mongoose.model("Like", LikeSchema);
