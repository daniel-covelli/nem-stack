import mongoose, { Schema } from "mongoose";

export const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: mongoose.Types.ObjectId, ref: "Like" },
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const Post = mongoose.model("Post", PostSchema);
