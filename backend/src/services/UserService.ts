import { Sketch, Attempt } from "../config/database.js";
import { Sequelize } from "sequelize";

export class UserService {
  static async getUserStats(id_user: number) {
    const sketchesCount = await Sketch.count({ where: { id_user } });
    
    // Numero di parole indovinate correttamente (is_correct = true)
    const guessedCount = await Attempt.count({
      where: { id_user, is_correct: true }
    });
    
    // Numero totale di tentativi effettuati
    const attemptsCount = await Attempt.count({ where: { id_user } });

    // Calcolo dei disegni su cui l'utente ha fatto 10 tentativi falliti di fila senza mai indovinare
    const attemptsGrouped = await Attempt.findAll({
      attributes: [
        "id_sketch",
        [Sequelize.fn("COUNT", Sequelize.col("id_attempt")), "attemptCount"],
        [Sequelize.fn("SUM", Sequelize.literal("CASE WHEN is_correct THEN 1 ELSE 0 END")), "correctCount"]
      ],
      where: { id_user },
      group: ["id_sketch"]
    });

    const unguessedCount = attemptsGrouped.filter((group: any) => {
      const count = parseInt(group.getDataValue("attemptCount"), 10);
      const correct = parseInt(group.getDataValue("correctCount"), 10);
      return count >= 10 && correct === 0;
    }).length;

    return {
      sketches_count: sketchesCount,
      guessed_count: guessedCount,
      attempts_count: attemptsCount,
      unguessed_count: unguessedCount
    };
  }
}
