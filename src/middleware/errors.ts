import { StatusCodes } from "http-status-codes";
import { AlreadyExists, BaseError, ValidationError } from "../error";
import { Request, Response, NextFunction } from "express";

// error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  if (err instanceof ValidationError || err instanceof AlreadyExists) {
    return res.status(err.status).json({
      status: "fail",
      message: err.message,
      data: err.errorData,
    });
  } else if (err instanceof BaseError) {
    return res.status(err.status).json({
      status: "error",
      message: err.message,
    });
  } else if (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: err.message,
    });
  }
};
