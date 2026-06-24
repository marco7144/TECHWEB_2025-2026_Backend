import { Router } from "express";
import { LeaderboardController } from "../controllers/LeaderboardController.js";

export const leaderboardsRouter = Router();

/**
 * @swagger
 *  /api/v1/leaderboards/players:
 *    get:
 *      description: Get ranking of best players based on correctly guessed words
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Player leaderboard retrieved successfully
 */
leaderboardsRouter.get("/api/v1/leaderboards/players", LeaderboardController.getPlayers);

/**
 * @swagger
 *  /api/v1/leaderboards/artists:
 *    get:
 *      description: Get ranking of best artists based on sketch guess accuracy
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Artist leaderboard retrieved successfully
 */
leaderboardsRouter.get("/api/v1/leaderboards/artists", LeaderboardController.getArtists);
