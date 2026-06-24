import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const usersRouter = Router();

/**
 * @swagger
 *  /api/v1/users/me/stats:
 *    get:
 *      description: Get personal stats for the authenticated user
 *      produces:
 *        - application/json
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: User statistics retrieved successfully
 *        401:
 *          description: Unauthorized
 */
usersRouter.get("/api/v1/users/me/stats", enforceAuthentication, UserController.getMyStats);
