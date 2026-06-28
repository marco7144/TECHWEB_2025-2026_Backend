import { Response, NextFunction } from "express";
import { Word, database } from "../config/database.js";
import { AuthenticatedRequest } from "../middleware/authorization.js";
import Jwt from "jsonwebtoken";

export class WordController {
  static async getRandomWords(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const words = await Word.findAll({
        order: database.random(),
        limit: 3,
        attributes: ["id_word", "text"]
      });

      const secret = process.env.TOKEN_SECRET;
      if (!secret) {
        throw new Error("TOKEN_SECRET is not defined in environment variables");
      }

      const wordIds = words.map((w: any) => w.id_word);

      const wordsToken = Jwt.sign(
        { id_user: req.id_user, word_ids: wordIds },
        secret,
        { expiresIn: "30m" }
      );

      res.json({
        words,
        token: wordsToken
      });
    } catch (error) {
      next(error);
    }
  }
}
