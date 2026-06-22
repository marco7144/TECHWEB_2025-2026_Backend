import { Request, Response, NextFunction } from "express";
import { Word, database } from "../config/database.js";

export class WordController {
  static async getRandomWords(req: Request, res: Response, next: NextFunction) {
    try {
      const words = await Word.findAll({
        order: database.random(),
        limit: 3,
        attributes: ["id_word", "text"]
      });
      res.json(words);
    } catch (error) {
      next(error);
    }
  }
}
