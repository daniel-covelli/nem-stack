import express from "express";
import { Post } from "../models/post";
import { validateSlugs } from "../middleware/validateData";

const post = express.Router();

post.get("/:id/likes", validateSlugs, async (req, res) => {
  const post = await Post.findById(req.params.id).populate("likes");
  res.send(post?.likes);
});

post.get("/:id", validateSlugs, async (req, res) => {
  const post = await Post.findById(req.params.id).populate(["likes", "owner"]);
  res.send(post);
});

export default post;
