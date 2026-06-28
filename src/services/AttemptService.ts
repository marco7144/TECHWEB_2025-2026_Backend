import { Attempt, Sketch, Word } from "../config/database.js";

export class AttemptService {
  
  static async createAttempt(id_user: number, id_sketch: number, guess: string) {
    // 1. Verifica che lo sketch esista nel DB
    const sketch = await Sketch.findByPk(id_sketch, {
      include: [{ model: Word, attributes: ["text"] }]
    });

    if (!sketch) {
      throw { status: 404, message: "Sketch not found" };
    }

    const sketchData = sketch.toJSON();

    // 2. L'utente non può indovinare i propri disegni
    if (sketchData.id_user === id_user) {
      throw { status: 403, message: "You cannot guess your own sketch" };
    }

    // 3. Recupera tutti i tentativi già fatti da questo utente su questo sketch
    const pastAttempts = await Attempt.findAll({
      where: { id_user, id_sketch }
    });

    // 4. Se ha già indovinato in passato, blocchiamo ulteriori tentativi
    const alreadyGuessed = pastAttempts.some((a: any) => a.is_correct);
    if (alreadyGuessed) {
      throw { status: 403, message: "You have already guessed this sketch" };
    }

    // 5. Se ha già esaurito i 10 tentativi falliti, blocchiamo
    if (pastAttempts.length >= 10) {
      throw { status: 403, message: "You have exhausted your attempts for this sketch" };
    }

    const cleanGuess = guess.trim().toLowerCase();

    // 5.5. Verifica se l'utente ha già provato questa identica parola in passato
    const alreadyTried = pastAttempts.some((a: any) => a.guess.trim().toLowerCase() === cleanGuess);
    if (alreadyTried) {
      throw { status: 400, message: "You have already tried this word" };
    }

    // 6. Confronto case-insensitive e senza spazi extra della risposta
    const correctWordText = (sketchData.Word as any).text;
    const cleanSolution = correctWordText.trim().toLowerCase();
    const isCorrect = cleanGuess === cleanSolution;

    // 7. Salva il tentativo nel DB
    const newAttempt = await Attempt.create({
      id_user,
      id_sketch,
      guess: guess.trim(),
      is_correct: isCorrect
    });

    const attemptsRemaining = 10 - (pastAttempts.length + 1);

    // 8. Risposta
    return {
      id_attempt: (newAttempt as any).id_attempt,
      guess: (newAttempt as any).guess,
      is_correct: isCorrect,
      attempts_remaining: attemptsRemaining,
      // Se indovinato, o se ha esaurito i 10 tentativi (attemptsRemaining == 0), svela la soluzione
      solution: (isCorrect || attemptsRemaining === 0) ? correctWordText : undefined
    };
  }
}
