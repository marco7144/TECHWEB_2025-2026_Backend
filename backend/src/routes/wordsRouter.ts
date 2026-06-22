import { Router } from "express";
import { WordController } from "../controllers/WordController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const wordsRouter = Router();

/**
 * @swagger
 *  /api/v1/words/random:
 *    get:
 *      description: Get 3 random words for drawing
 *      produces:
 *        - application/json
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: A list of 3 random words
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id_word:
 *                      type: integer
 *                    text:
 *                      type: string
 *        401:
 *          description: Unauthorized
 */
wordsRouter.get("/api/v1/words/random", enforceAuthentication, WordController.getRandomWords);
