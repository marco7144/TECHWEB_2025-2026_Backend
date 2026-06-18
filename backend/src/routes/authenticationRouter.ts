import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController.js";

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
authenticationRouter.post("/auth", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAuthenticated = await AuthController.checkCredentials(req, res);
    if (isAuthenticated) {
      const token = AuthController.issueToken(req.body.username);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
});

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
authenticationRouter.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = await AuthController.saveUser(req, res);
    res.status(201).json({ username: user.username });
  } catch (error) {
    next({ status: 500, message: "Could not create user account" });
  }
});
