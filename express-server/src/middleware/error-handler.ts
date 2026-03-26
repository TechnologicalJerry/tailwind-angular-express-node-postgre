import { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/http-error";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: "Request body contains invalid JSON." });
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
    return;
  }

  console.error("Unhandled application error", error);

  response.status(500).json({
    error: "An unexpected error occurred.",
  });
};