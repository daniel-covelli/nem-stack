import { NextFunction, Response, Request } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from 'http-status-codes';
import { ValidationError } from "../error";

export default function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, _: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    [issue.path]: issue.message,
                }))
                next(new ValidationError(errorMessages))
            } else {
                next(error)
            }
        }
    };
}