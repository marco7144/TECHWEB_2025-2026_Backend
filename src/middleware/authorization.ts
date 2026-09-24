import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";

export interface AuthenticatedRequest extends Request {
  username?: string;
  id_user?: number;
}

export interface DecodedToken {
  username: string;
  id_user: number;
  token_version: number;
}

async function verifyToken(token: string): Promise<DecodedToken | null> {
  return new Promise((resolve) => {
    AuthService.isTokenValid(token, async (err, decodedToken) => {
      if (err || !decodedToken) {
        return resolve(null);
      }
      const decoded = decodedToken as DecodedToken;
      try {
        const isValid = await AuthService.validateTokenVersion(decoded.id_user, decoded.token_version);
        if (!isValid) {
          return resolve(null);
        }
        resolve(decoded);
      } catch {
        resolve(null);
      }
    });
  });
}

function createAuthMiddleware(isRequired: boolean, invalidMessage: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (isRequired) {
        return next({ status: 401, message: "Unauthorized" });
      }
      return next();
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = await verifyToken(token);
      if (!decoded) {
        if (!isRequired) {
          req.username = undefined;
          req.id_user = undefined;
          return next();
        }
        return next({ status: 401, message: invalidMessage });
      }
      
      req.username = decoded.username;
      req.id_user = decoded.id_user;
      next();
    } catch (error) {
      if (!isRequired) {
        req.username = undefined;
        req.id_user = undefined;
        return next();
      }
      next(error);
    }
  };
}

export const enforceAuthentication = createAuthMiddleware(true, "Unauthorized");
export const optionalAuthentication = createAuthMiddleware(false, "Invalid or expired token");
