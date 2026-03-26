import http from "node:http";
import { config } from "./config";
import { db } from "./db.config";
import { createApp } from "./server";

const app = createApp();
const server = http.createServer(app);

const shutdown = (signal: string): void => {
  console.info(`${signal} received. Shutting down HTTP server.`);

  server.close(async (serverError) => {
    try {
      await db.close();
    } finally {
      process.exit(serverError ? 1 : 0);
    }
  });

  setTimeout(() => {
    console.error("Graceful shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10000).unref();
};

const startServer = async (): Promise<void> => {
  try {
    await db.initialize();

    server.listen(config.port, () => {
      console.info(`Express server listening on port ${config.port} in ${config.environment} mode.`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${config.port} is already in use.`);
      } else {
        console.error("Unhandled server error", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to initialize application", error);
    await db.close().catch(() => undefined);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

void startServer();