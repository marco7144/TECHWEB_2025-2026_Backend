import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { Request, Response } from "express";
import { User } from "../config/database.js";
import Jwt from "jsonwebtoken";

const scryptPromise = promisify(scrypt);

export class AuthController {
  private static async hashPassword(password: string, salt: string): Promise<string> {
    const derivedKey = (await scryptPromise(password, salt, 64)) as Buffer;
    return derivedKey.toString("hex");
  }

  static async checkCredentials(req: Request, res: Response): Promise<boolean> {
    const { username, password } = req.body;
    if (!username || !password) return false;

    const found = await User.findOne({
      where: {
        username
      }
    });

    if (!found) return false;

    const salt = found.get("salt") as string;
    const storedPassword = found.get("password") as string;

    const hashedPassword = await AuthController.hashPassword(password, salt);
    return storedPassword === hashedPassword;
  }

  static async saveUser(req: Request, res: Response) {
    const { username, password } = req.body;
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = await AuthController.hashPassword(password, salt);
    return User.create({ username, password: hashedPassword, salt });
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

