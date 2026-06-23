import { Router } from "express";
import { SketchController } from "../controllers/SketchController.js";
import { enforceAuthentication, optionalAuthentication } from "../middleware/authorization.js";

export const sketchesRouter = Router();

/**
 * @swagger
 *  /api/v1/sketches:
 *    post:
 *      description: Create a new sketch
 *      produces:
 *        - application/json
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        description: Sketch details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id_word:
 *                  type: integer
 *                  example: 1
 *                path:
 *                  type: string
 *                  example: "data:image/png;base64,iVBORw0..."
 *      responses:
 *        201:
 *          description: Sketch created successfully
 *        400:
 *          description: Missing parameter or validation error
 *        401:
 *          description: Unauthorized
 *        444:
 *          description: Word not found
 */
sketchesRouter.post("/api/v1/sketches", enforceAuthentication, SketchController.createSketch);

/**
 * @swagger
 *  /api/v1/sketches:
 *    get:
 *      description: List all sketches with anti-spoiler word hiding
 *      produces:
 *        - application/json
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: A list of sketches
 */
sketchesRouter.get("/api/v1/sketches", optionalAuthentication, SketchController.listSketches);

/**
 * @swagger
 *  /api/v1/sketches/{id}:
 *    get:
 *      description: Get details of a single sketch
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
 *      responses:
 *        200:
 *          description: Sketch details
 *        404:
 *          description: Sketch not found
 */
sketchesRouter.get("/api/v1/sketches/:id", optionalAuthentication, SketchController.getSketchById);
