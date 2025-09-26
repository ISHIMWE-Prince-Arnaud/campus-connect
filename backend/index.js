import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import sanitize from "mongo-sanitize";
import { connectDb } from "./utils/db.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/error.js";
import { initSocket } from "./socket.js";
import { startWeeklyCycle } from "./jobs/weeklyCycle.js";

import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import questsRoutes from "./routes/quests.js";
import chatsRoutes from "./routes/chats.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import adminRoutes from "./routes/admin.js";
import healthRoutes from "./routes/health.js";
import uploadRoute from "./routes/upload.js";
import { configDotenv } from "dotenv";

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
const port = process.env.PORT || 5000;

app.set("io", io);

app.use(helmet());
app.use(cors({ origin: process.env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use((req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitize(req.body);
  }
  next();
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/quests", questsRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", healthRoutes);
app.use("/api/upload", uploadRoute);

app.use(errorHandler);

startWeeklyCycle(io);

await connectDb().then(() => console.log("Connected to DB"));
server.listen(port, () => console.log(`Server listening on port : ${port}`));
