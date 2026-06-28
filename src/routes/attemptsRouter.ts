import { Router } from "express";
import { AttemptController } from "../controllers/AttemptController.js";
import { enforceAuthentication } from "../middleware/authorization.js";
import { validateCreateAttempt } from "../validators/attemptValidator.js";

export const attemptsRouter = Router();

/**
 * @swagger
 *  /api/v1/sketches/{id}/attempts:
 *    post:
 *      description: Submit a guess for a sketch
 *      produces:
 *        - application/json
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        description: Guess attempt details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                guess:
 *                  type: string
 *                  example: "gatto"
 *      responses:
 *        201:
 *          description: Attempt registered successfully
 *        400:
 *          description: Invalid parameters
 *        403:
 *          description: Action forbidden (e.g. self guess, no attempts left)
 *        404:
 *          description: Sketch not found
 */
attemptsRouter.post("/api/v1/sketches/:id/attempts", enforceAuthentication, validateCreateAttempt, AttemptController.submitAttempt);
