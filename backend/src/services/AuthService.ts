import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { User } from "../config/database.js";

const scryptPromise = promisify(scrypt);

export class AuthService {
  private static async hashPassword(password: string, salt: string): Promise<string> {
    const derivedKey = (await scryptPromise(password, salt, 64)) as Buffer;
    return derivedKey.toString("hex");
  }

  static async verifyCredentials(username: string, password: string): Promise<any | null> {
    const found = await User.findOne({
      where: {
        username
      }
    });

    if (!found) return null;

    const salt = found.get("salt") as string;
    const storedPassword = found.get("password") as string;

    const hashedPassword = await AuthService.hashPassword(password, salt);
    return storedPassword === hashedPassword ? found : null;
  }

  static async registerUser(username: string, password: string): Promise<any> {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = await AuthService.hashPassword(password, salt);
    return User.create({ username, password: hashedPassword, salt });
  }
}
