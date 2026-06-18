import { createHash } from "crypto";
import { Request, Response } from "express";
import { User } from "../config/database.js";
import Jwt from "jsonwebtoken";

export class AuthController {
  static async checkCredentials(req: Request, res: Response): Promise<boolean> {
    const { username, password } = req.body;
    if (!username || !password) return false;

    const hashedPassword = createHash("sha256").update(password).digest("hex");

    const found = await User.findOne({
      where: {
        username,
        password: hashedPassword
      }
    });

    return found !== null;
  }

  static async saveUser(req: Request, res: Response) {
    const { username, password } = req.body;
    return User.create({ username, password });
  }

  static issueToken(username: string): string {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    return Jwt.sign({ username }, secret, { expiresIn: "24h" });
  }

  static isTokenValid(token: string, callback: Jwt.VerifyCallback) {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    Jwt.verify(token, secret, callback);
  }
}
