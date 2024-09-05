import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import user from "./router/user";
import bodyParser from "body-parser";
import { errorHandler } from "./middleware/errors";
import like from "./router/like";
import post from "./router/post";

config();

const app = express();
const port = 3000;
const DB_URI = process.env.DB_URI || "";

app.use(bodyParser.json());

mongoose.connect(DB_URI).then(() => console.log("Connected to MongoDB"));

app.get("/", (_, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/user", user);
app.use("/like", like);
app.use("/post", post);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
