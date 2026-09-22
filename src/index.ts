import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import "./config/database.js";
import { authenticationRouter } from "./routes/authenticationRouter.js";
import { wordsRouter } from "./routes/wordsRouter.js";
import { sketchesRouter } from "./routes/sketchesRouter.js";
import { attemptsRouter } from "./routes/attemptsRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { leaderboardsRouter } from "./routes/leaderboardsRouter.js";

import { swaggerSpec } from "./config/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(authenticationRouter);
app.use(wordsRouter);
app.use(sketchesRouter);
app.use(attemptsRouter);
app.use(usersRouter);
app.use(leaderboardsRouter);

app.get("/api/v1/test", (req: Request, res: Response) => {
  res.json({ message: "Backend infrastructure active" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack || err);
  const status = typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500);
  const message = err.message || err.description || err.error || "An error occurred";
  res.status(status).json({
    error: message,
    code: status,
    description: message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
