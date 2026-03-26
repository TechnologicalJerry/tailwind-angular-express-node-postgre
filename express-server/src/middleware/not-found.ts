import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export const notFoundHandler = (_request: Request, _response: Response, next: NextFunction): void => {
  next(new HttpError(404, "Route not found."));
};