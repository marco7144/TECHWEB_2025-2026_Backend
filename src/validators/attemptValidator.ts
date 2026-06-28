import { Request, Response, NextFunction } from "express";

export function validateCreateAttempt(req: Request, res: Response, next: NextFunction) {
  const id_sketch = parseInt(req.params.id, 10);
  if (isNaN(id_sketch)) {
    return res.status(400).json({ error: "Invalid sketch id" });
  }

  const { guess } = req.body;
  if (!guess || typeof guess !== "string" || guess.trim() === "") {
    return res.status(400).json({ error: "guess is required and must be a non-empty string" });
  }

  next();
}
