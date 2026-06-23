import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authorization.js";
import { SketchService } from "../services/SketchService.js";

export class SketchController {
  
  // POST /api/v1/sketches (Protetto)
  static async createSketch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id_word, path } = req.body;
      const id_user = req.id_user;

      const newSketch = await SketchService.createSketch(id_user!, id_word, path);
      res.status(201).json(newSketch);
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  // GET /api/v1/sketches (Pubblico con optional authentication)
  static async listSketches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id_user = req.id_user;
      const sketches = await SketchService.listSketches(id_user);
      res.json(sketches);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/sketches/:id (Pubblico con optional authentication)
  static async getSketchById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const id_user = req.id_user;
      const sketch = await SketchService.getSketchById(id, id_user);
      res.json(sketch);
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
}
