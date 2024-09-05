import express from "express";
import { Post } from "../models/post";

const post = express.Router();

post.get("/:id/likes", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("likes");
  res.send(post?.likes);
});

post.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate(["likes", "owner"]);
  res.send(post);
});

export default post;
