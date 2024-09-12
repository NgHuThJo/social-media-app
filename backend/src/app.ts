// Third party
import http from "node:http";
import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@backend/routers/api.js";
import logger from "@shared/utils/logger.js";
import { createContext } from "./routers/trpc.js";
import { SocketService } from "./services/socket-io.js";

// Entry point file
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
export const socketService = new SocketService(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.PROXY_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.use(
  "/api",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => createContext({ req, res, socketService }),
  }),
);

// Error handler
const errorHandler: ErrorRequestHandler = (err, _req, _res, _next) => {
  logger.error(err);
};

app.use(errorHandler);
