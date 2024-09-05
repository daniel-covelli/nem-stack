import mongoose, { Schema } from "mongoose";

import { PostSchema } from "./post";

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  posts: [PostSchema],
  likes: {
    type: mongoose.Types.ObjectId,
    ref: "Like",
  },
});

export const User = mongoose.model("User", UserSchema);
