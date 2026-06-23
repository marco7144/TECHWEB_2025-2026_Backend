import { Request, Response, NextFunction } from "express";

export function validateCreateSketch(req: Request, res: Response, next: NextFunction) {
  const { id_word, path } = req.body;

  if (id_word === undefined || id_word === null) {
    return res.status(400).json({ error: "id_word is required" });
  }

  const wordId = parseInt(id_word, 10);
  if (isNaN(wordId)) {
    return res.status(400).json({ error: "id_word must be a valid integer" });
  }

  if (!path || typeof path !== "string" || path.trim() === "") {
    return res.status(400).json({ error: "path (Base64 image) is required and must be a non-empty string" });
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
