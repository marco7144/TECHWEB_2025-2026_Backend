import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authorization.js";
import { AttemptService } from "../services/AttemptService.js";

export class AttemptController {
  
  // POST /api/v1/sketches/:id/attempts (Protetto)
  static async submitAttempt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id_sketch = parseInt(req.params.id, 10);//converto ":id" in intero
      const { guess } = req.body;//prendo "guess" dal body
      const id_user = req.id_user;//prendo id_user dal token

      const result = await AttemptService.createAttempt(id_user!, id_sketch, guess);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
}
