import express, { Request } from "express";
import { User } from "../models/user";
import validateData from "../middleware/validateData";
import { AlreadyExists, NotFoundError } from "../error";
import { z } from "zod";
import { Document } from "mongoose";
import { Post } from "../models/post";

const user = express.Router();

type UserRequest = Request & {
  user?: Document & ReturnType<(typeof User)["hydrate"]>;
};

user.param("userId", async (req: UserRequest, _, next) => {
  if (!req.params.userId) {
    return next(new NotFoundError("User not found"));
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new NotFoundError("User not found"));
  }
  req.user = user;
  next();
});

const userBodySchema = z.object({
  email: z.string().email({ message: "Invalid email provided" }),
  name: z.string(),
});

user
  .route("/:userId")
  .get(async (req: UserRequest, res) => {
    res.send(req.user);
  })
  .patch(
    validateData(userBodySchema.partial()),
    async (req: UserRequest, res, next) => {
      const exists = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user?.id },
      });
      if (exists) {
        return next(new AlreadyExists([{ email: "Already exists" }]));
      }
      if (req.user) {
        req.user.set(req.body);
        await req.user.save();
      }

      res.send(req.user);
    },
  )
  .delete(async (req, res) => {
    await User.deleteOne({ _id: req.params.userId });
    res.send(true);
  });

const postPostRequest = z.object({
  title: z.string(),
  text: z.string(),
});

user
  .route("/:userId/posts")
  .get(async (req: UserRequest, res) => {
    if (req.user) {
      res.send(req.user.posts);
    }
  })
  .post(validateData(postPostRequest), async (req: UserRequest, res) => {
    if (req.user) {
      const post = await Post.create(req.body);
      post.owner = req.user.id;
      await post.save();
      req.user.posts.push(post);
      await req.user.save();
      res.send(post);
    }
  });

user.route("/:userId/likes").get(async (req: UserRequest, res) => {
  if (req.user) {
    const user = await req.user.populate("likes");
    res.send(user.likes);
  }
});

user
  .route("/")
  .get(async (_, res) => {
    const users = await User.find();
    res.send(users);
  })
  .post(validateData(userBodySchema), async (req, res, next) => {
    const exists = await User.exists({ email: req.body.email });
    if (exists) {
      return next(new AlreadyExists([{ email: "Already exists" }]));
    }
    res.send(await new User(req.body).save());
  });

export default user;
