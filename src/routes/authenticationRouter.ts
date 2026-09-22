import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validateSignup, validateAuth } from "../validators/authValidator.js";

export const authenticationRouter = express.Router();

/**
 * @swagger
 *  /auth:
 *    post:
 *      description: Authenticate user
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: User credentials to authenticate
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserCredentials'
 *      responses:
 *        200:
 *          description: User authenticated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginResponse'
 *        400:
 *          description: Missing or invalid credentials
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        401:
 *          description: Invalid credentials
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
authenticationRouter.post("/auth", validateAuth, AuthController.login);

/**
 * @swagger
 *  /signup:
 *    post:
 *      description: Create a new user account
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: User registration details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserCredentials'
 *      responses:
 *        201:
 *          description: User created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SignupResponse'
 *        400:
 *          description: Validation error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        409:
 *          description: Username already exists
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
authenticationRouter.post("/signup", validateSignup, AuthController.signup);

