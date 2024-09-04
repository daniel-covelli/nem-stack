import express, { Request } from "express"
import { User, userZodSchema } from "../models/user";
import validateData from "../middleware/validateData";
import { TypeOf } from "zod";
import { AlreadyExists } from "../error";

const user = express.Router()

user.route("/:userId",)
    .get(async (req, res) => {
        const user = await User.findById(req.params.userId)
        res.send(user?.toJSON())
    })
    .patch(validateData(userZodSchema.partial()), async (req, res) => {
        res.send(await User.findOneAndUpdate({ _id: req.params.userId }, req.body))
    });

user.route("/")
    .get(async (_, res) => {
        const user = await User.find()
        res.send(user)
    })
    .post(validateData(userZodSchema), async (req: Request, res, next) => {
        const exists = await User.exists({ email: req.body.email })
        if (exists) {
            next(new AlreadyExists([{ email: "Already exists" }]))
        }
        const user = new User(req.body)
        await user.save()
        res.send(user?.toJSON())
    })

export default user