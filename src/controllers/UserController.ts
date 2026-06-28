import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authorization.js";
import { UserService } from "../services/UserService.js";

export class UserController {
  static async getMyStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id_user = req.id_user;
      if (!id_user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const stats = await UserService.getUserStats(id_user);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
