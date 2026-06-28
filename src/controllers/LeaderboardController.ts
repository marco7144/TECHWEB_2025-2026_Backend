import { Request, Response, NextFunction } from "express";
import { LeaderboardService } from "../services/LeaderboardService.js";

export class LeaderboardController {
  static async getPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await LeaderboardService.getPlayerLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  }

  static async getArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await LeaderboardService.getArtistLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
