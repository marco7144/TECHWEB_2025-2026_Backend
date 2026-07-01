import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User } from "../config/database.js";
import { Sequelize } from "sequelize";
import Jwt from "jsonwebtoken";

const scryptPromise = promisify(scrypt);

export class AuthService {
  private static async hashPassword(password: string, salt: string): Promise<string> {
    const derivedKey = (await scryptPromise(password, salt, 64)) as Buffer;
    return derivedKey.toString("hex");
  }

  static async verifyCredentials(username: string, password: string): Promise<any | null> {
    const found = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("username")),
        username.toLowerCase()
      )
    });
    //SELECT * FROM `Users` 
    //WHERE LOWER(`username`) = 'marco' 
    //LIMIT 1;

    if (!found) return null;

    const salt = found.get("salt") as string;
    const storedPassword = found.get("password") as string;

    const hashedPassword = await AuthService.hashPassword(password, salt);

    //timing attack resistance, confronto costante delle password.
    const storedBuf = Buffer.from(storedPassword, "hex");
    const hashedBuf = Buffer.from(hashedPassword, "hex");

    if (storedBuf.length !== hashedBuf.length) {
      return null;
    }

    return timingSafeEqual(storedBuf, hashedBuf) ? found : null;
  }

  static async registerUser(username: string, password: string): Promise<any> {
    // Verifica unicità dell'username case-insensitive
    const existing = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("username")),
        username.toLowerCase()
      )
    });
    //SELECT * FROM `Users` 
    //WHERE LOWER(`username`) = 'marco' 
    //LIMIT 1;

    if (existing) {
      const error = new Error("Username already exists");
      error.name = "SequelizeUniqueConstraintError";
      throw error;
    }

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = await AuthService.hashPassword(password, salt);
    return User.create({ username, password: hashedPassword, salt });
  }

  static issueToken(user: any): string {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    return Jwt.sign(
      { username: user.username, id_user: user.id_user, token_version: user.token_version },
      secret,
      { expiresIn: "24h" }
    );
  }

  static isTokenValid(token: string, callback: Jwt.VerifyCallback) {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    Jwt.verify(token, secret, callback);
  }

  static async validateTokenVersion(id_user: number, token_version: number): Promise<boolean> {
    const user = await User.findByPk(id_user);
    return !!user && user.get("token_version") === token_version;
  }
}
