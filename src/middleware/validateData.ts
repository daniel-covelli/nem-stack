/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response, Request } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../error";
import mongoose from "mongoose";

export default function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          [issue.path]: issue.message,
        }));
        next(new ValidationError(errorMessages));
      } else {
        next(error);
      }
    }
  };
}

const valueSchema = z.string().refine(
  (val) => {
    return mongoose.Types.ObjectId.isValid(val);
  },
  {
    message: "Invalid ObjectId",
  },
);

const slugsSchema = z.record(valueSchema);

export function validateSlugs() {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      slugsSchema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => {
          console.log(issue);
          return {
            [issue.path]: issue.message,
          };
        });
        next(new ValidationError(errorMessages));
      } else {
        next(error);
      }
    }
  };
}
