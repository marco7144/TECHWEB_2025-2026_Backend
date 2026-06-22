import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import "./config/database.js";
import { authenticationRouter } from "./routes/authenticationRouter.js";
import { wordsRouter } from "./routes/wordsRouter.js";
import { enforceAuthentication } from "./middleware/authorization.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "TechWeb Project API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*Router.ts", "./dist/routes/*Router.js"],
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(authenticationRouter);
app.use(wordsRouter);
//app.use(enforceAuthentication);

app.get("/api/v1/test", (req: Request, res: Response) => {
  res.json({ message: "Backend infrastructure active" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
