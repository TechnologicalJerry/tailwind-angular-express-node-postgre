import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import routes from "./routes";

const createCorsOriginConfig = (): boolean | string[] => {
  if (config.corsOrigin === "*") {
    return true;
  }

  return config.corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const createApp = (): Application => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: createCorsOriginConfig(),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(morgan(config.environment === "production" ? "combined" : "dev"));

  app.use("/api/v1", routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
