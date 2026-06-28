import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";

export interface AuthenticatedRequest extends Request {
  username?: string;
  id_user?: number;
}

export interface DecodedToken {
  username: string;
  id_user: number;
}

export function enforceAuthentication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({ status: 401, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  AuthService.isTokenValid(token, (err, decodedToken) => {
    if (err || !decodedToken) {
      return next({ status: 401, message: "Unauthorized" });
    }
    
    const decoded = decodedToken as DecodedToken;
    req.username = decoded.username;
    req.id_user = decoded.id_user;
    next();
  });
}

export function optionalAuthentication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Se l'header manca o non ha il formato Bearer si procede come ospite
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  AuthService.isTokenValid(token, (err, decodedToken) => {
    if (err || !decodedToken) {
      // Se l'utente ha inviato un token invalido o scaduto, 
      // restituiamo 401 anziché farlo passare come ospite.
      return next({ status: 401, message: "Invalid or expired token" });
    }

    const decoded = decodedToken as DecodedToken;
    req.username = decoded.username;
    req.id_user = decoded.id_user;
    next();
  });
}
