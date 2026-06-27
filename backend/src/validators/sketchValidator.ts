import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authorization.js";
import Jwt from "jsonwebtoken";

export function validateCreateSketch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { id_word, path, words_token } = req.body;

  if (id_word === undefined || id_word === null) {
    return res.status(400).json({ error: "id_word is required" });
  }

  const wordId = parseInt(id_word, 10);
  if (isNaN(wordId)) {
    return res.status(400).json({ error: "id_word must be a valid integer" });
  }

  if (!path || typeof path !== "string" || path.trim() === "") {
    return res.status(400).json({ error: "path is required and must be a non-empty string" });
  }

  let isValidJson = false;
  try {
    const parsed = JSON.parse(path);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.objects)) {
      isValidJson = true;
    }
  } catch (e) {
    // Not a valid JSON string
  }

  if (!isValidJson) {
    return res.status(400).json({
      error: "path must be a valid JSON representation of sketch paths (with an 'objects' array)"
    });
  }

  // Validazione del token delle parole offerte
  if (!words_token || typeof words_token !== "string") {
    return res.status(400).json({ error: "words_token is required" });
  }

  try {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }

    const decoded = Jwt.verify(words_token, secret) as any;

    if (decoded.id_user !== req.id_user) {
      return res.status(403).json({ error: "words_token does not belong to the authenticated user" });
    }

    if (!decoded.word_ids || !decoded.word_ids.includes(wordId)) {
      return res.status(400).json({ error: "The selected word is not one of the random words offered to you" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: "Invalid or expired words_token: " + error.message });
  }

  // Sovrascriviamo nel body con il tipo numerico corretto
  req.body.id_word = wordId;

  next();
}

export function validateSketchId(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid sketch id" });
  }
  next();
}
