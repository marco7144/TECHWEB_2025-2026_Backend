import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
import Jwt from "jsonwebtoken";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.registerUser(username, password);
      res.status(201).json({ username: user.username });
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next({ status: 409, message: "Username already exists" });
      } else {
        next({ status: 500, message: "Could not create user account" });
      }
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.verifyCredentials(username, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = AuthController.issueToken(user);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  static issueToken(user: any): string {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    return Jwt.sign({ username: user.username, id_user: user.id_user }, secret, { expiresIn: "24h" });
  }

  static isTokenValid(token: string, callback: Jwt.VerifyCallback) {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    Jwt.verify(token, secret, callback);
  }
}


