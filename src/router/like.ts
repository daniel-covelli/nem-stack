import express from "express";
import { User } from "../models/user";
import validateData, { validateSlugs } from "../middleware/validateData";
import { z } from "zod";
import mongoose from "mongoose";
import { Post } from "../models/post";
import { Like } from "../models/like";

const like = express.Router();

const likePostRequest = z.object({
  userId: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
  postId: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
});

like.post("/", validateData(likePostRequest), async (req, res) => {
  const like = new Like({ user: req.body.userId, post: req.body.postId });
  await like.save();
  await Post.findByIdAndUpdate(req.body.postId, { $push: { likes: like._id } });
  await User.findByIdAndUpdate(req.body.userId, { $push: { likes: like._id } });
  res.send(like);
});

like.get("/:id", validateSlugs(), async (req, res, next) => {
  try {
    const like = await Like.findById({ _id: req.params.id }).populate([
      "post",
      "user",
    ]);
    res.send(like);
  } catch (err) {
    console.log(err);
    next();
  }
});

export default like;
