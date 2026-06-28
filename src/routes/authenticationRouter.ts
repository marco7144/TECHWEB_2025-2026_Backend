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
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: Kyle
 *                password:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
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
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: Kyle
 *                password:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        201:
 *          description: User created successfully
 *        500:
 *          description: Internal server error
 */
authenticationRouter.post("/signup", validateSignup, AuthController.signup);

