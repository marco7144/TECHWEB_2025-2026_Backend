import { Sketch, Word, User, Attempt } from "../config/database.js";

export class SketchService {
  
  static async createSketch(id_user: number, id_word: number, path: string) {
    // Verifica che la parola esista nel DB
    const word = await Word.findByPk(id_word);
    if (!word) {
      throw { status: 404, message: "Word not found" };
    }

    // Crea lo sketch
    return Sketch.create({
      id_user,
      id_word,
      path
    });
  }

  static async listSketches(id_user?: number) {
    // Recupera tutti gli sketch con autore e testo della parola
    const sketches = await Sketch.findAll({
      include: [
        { model: User, attributes: ["username"] },
        { model: Word, attributes: ["text"] }
      ],
      order: [["timestamp", "DESC"]]
    });

    // Se l'utente è loggato, cerchiamo tutti i suoi tentativi per capire se ha indovinato o esaurito i 10 tentativi
    let attempts: any[] = [];
    if (id_user) {
      attempts = await Attempt.findAll({
        where: { id_user }
      });
    }

    // Trasformiamo i risultati applicando la logica anti-spoiler
    return sketches.map((sketch: any) => {
      const sketchData = sketch.toJSON();

      // Condizioni per vedere la soluzione:
      const isAuthor = id_user && sketchData.id_user === id_user;
      const hasGuessed = attempts.some(a => a.id_sketch === sketchData.id_sketch && a.is_correct);
      const sketchAttempts = attempts.filter(a => a.id_sketch === sketchData.id_sketch);
      const hasFailedTenTimes = sketchAttempts.length >= 10;

      // Aggiungiamo l'elenco dei tentativi passati fatti dall'utente per questo sketch
      sketchData.user_attempts = sketchAttempts.map((a: any) => ({
        guess: a.guess,
        is_correct: a.is_correct,
        timestamp: a.timestamp
      }));

      // Se nessuna delle condizioni è soddisfatta, nascondiamo la parola corretta
      if (!isAuthor && !hasGuessed && !hasFailedTenTimes) {
        if (sketchData.Word) {
          sketchData.Word.text = undefined;
        }
        sketchData.id_word = undefined;
      }

      return sketchData;
    });
  }

  static async getSketchById(id: number, id_user?: number) {
    const sketch = await Sketch.findByPk(id, {
      include: [
        { model: User, attributes: ["username"] },
        { model: Word, attributes: ["text"] }
      ]
    });

    if (!sketch) {
      throw { status: 404, message: "Sketch not found" };
    }

    const sketchData = sketch.toJSON();
    const isAuthor = id_user && sketchData.id_user === id_user;

    let hasGuessed = false;
    let hasFailedTenTimes = false;
    let userAttempts: any[] = [];

    if (id_user) {
      userAttempts = await Attempt.findAll({
        where: { id_user, id_sketch: sketchData.id_sketch }
      });
      hasGuessed = userAttempts.some((a: any) => a.is_correct);
      hasFailedTenTimes = userAttempts.length >= 10;
    }

    // Aggiungiamo l'elenco dei tentativi passati fatti dall'utente per questo sketch
    sketchData.user_attempts = userAttempts.map((a: any) => ({
      guess: a.guess,
      is_correct: a.is_correct,
      timestamp: a.timestamp
    }));

    if (!isAuthor && !hasGuessed && !hasFailedTenTimes) {
      if (sketchData.Word) {
        sketchData.Word.text = undefined;
      }
      sketchData.id_word = undefined;
    }

    return sketchData;
  }
}
