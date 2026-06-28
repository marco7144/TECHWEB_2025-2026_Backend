import { Request, Response, NextFunction } from "express";

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;

  // 1. Validate username presence and type
  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Username is required and must be a non-empty string" });
  }

  // 2. Validate username format (alphanumeric, length between 3 and 20)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: "Username must be between 3 and 20 characters, and can only contain letters, numbers, and underscores"
    });
  }

  // 3. Validate password presence, type and minimum length
  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password is required and must be at least 8 characters long" });
  }

  // If validation passes, proceed to the controller
  next();
}

export function validateAuth(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  next();
}
