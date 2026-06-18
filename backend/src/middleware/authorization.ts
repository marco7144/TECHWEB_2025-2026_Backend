import { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController.js";

export interface AuthenticatedRequest extends Request {
  username?: string;
}

export function enforceAuthentication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next({ status: 401, message: "Unauthorized" });
  }

  AuthController.isTokenValid(token, (err, decodedToken: any) => {
    if (err) {
      return next({ status: 401, message: "Unauthorized" });
    }
    req.username = decodedToken.username;
    next();
  });
}
