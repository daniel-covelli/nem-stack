import mongoose from "mongoose";
import { extendZod, zodSchema } from "@zodyac/zod-mongoose";

import { z } from "zod";

extendZod(z);

export const userZodSchema = z.object({
    name: z.string(),
    email: z.string().email("This is not a valid email."),
})

const UserSchema = zodSchema(userZodSchema);

export const User = mongoose.model('User', UserSchema);