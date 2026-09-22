import { Router } from "express";
import { SketchController } from "../controllers/SketchController.js";
import { enforceAuthentication, optionalAuthentication } from "../middleware/authorization.js";
import { validateCreateSketch, validateSketchId } from "../validators/sketchValidator.js";

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
 *              $ref: '#/components/schemas/CreateSketchRequest'
 *      responses:
 *        201:
 *          description: Sketch created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BackendSketch'
 *        400:
 *          description: Missing parameter or validation error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        403:
 *          description: Forbidden - token does not belong to authenticated user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        404:
 *          description: Word not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
sketchesRouter.post("/api/v1/sketches", enforceAuthentication, validateCreateSketch, SketchController.createSketch);

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
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/BackendSketch'
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
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SketchDetail'
 *        404:
 *          description: Sketch not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
sketchesRouter.get("/api/v1/sketches/:id", optionalAuthentication, validateSketchId, SketchController.getSketchById);
