import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";

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

      const token = AuthService.issueToken(user);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
