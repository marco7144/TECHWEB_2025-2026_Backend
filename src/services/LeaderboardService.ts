import { User, Attempt, Sketch } from "../config/database.js";
import { Sequelize } from "sequelize";

export class LeaderboardService {
  
  // Classifica dei migliori giocatori (in base alle parole indovinate)
  static async getPlayerLeaderboard() {
    // #region SQL Equivalente (Top 10 Players)
    /*
    SELECT 
        "User"."id_user", 
        "User"."username", 
        COUNT("Attempts"."id_attempt") AS "score"
    FROM "Users" AS "User"
    INNER JOIN "Attempts" AS "Attempts" ON "User"."id_user" = "Attempts"."user_id" 
    WHERE "Attempts"."is_correct" = true
    GROUP BY "User"."id_user", "User"."username"
    ORDER BY "score" DESC
    LIMIT 10;
    */
    // #endregion
    const players = await User.findAll({
      subQuery: false, // Evita la query di paginazione nidificata che rompe SQLite
      attributes: [
        "id_user",
        "username",
        [
          Sequelize.literal('COALESCE(SUM(CASE WHEN "Attempts"."is_correct" THEN 1 ELSE 0 END), 0)'),
          "score"
        ]
      ],
      include: [{
        model: Attempt,
        attributes: [],
        required: false // LEFT JOIN: include anche gli utenti con 0 parole indovinate o solo tentativi falliti
      }],
      group: ["User.id_user", "User.username"],
      order: [
        [Sequelize.literal("score"), "DESC"],
        ["username", "ASC"]
      ],
      limit: 10
    });

    return players.map((p: any) => ({
      id_user: p.id_user,
      username: p.username,
      score: parseInt(p.getDataValue("score") || "0", 10)
    }));
  }

  // Classifica dei migliori disegnatori (in base alla % di successo dei loro disegni presso altri utenti)
  static async getArtistLeaderboard() {
    const allUsers = await User.findAll({ attributes: ["id_user", "username"] });

    // Recuperiamo solo id_sketch e id_user (escludendo l'enorme colonna 'path') con i rispettivi tentativi
    const sketches = await Sketch.findAll({
      attributes: ["id_sketch", "id_user"],
      include: [
        {
          model: Attempt,
          attributes: ["id_attempt", "id_user", "is_correct"],
          required: false // LEFT JOIN per includere anche sketch senza tentativi
        }
      ]
    });

    // raggruppo gli sketch per id_user in una Map 
    const sketchesByUserId = new Map<number, any[]>();
    for (const sketch of sketches) {
      const authorId = (sketch as any).id_user;
      if (!sketchesByUserId.has(authorId)) {
        sketchesByUserId.set(authorId, []);
      }
      sketchesByUserId.get(authorId)!.push(sketch);
    }

    const leaderboard = allUsers.map((user: any) => {
      // Prendiamo gli sketch di cui l'utente è l'autore dalla Map
      const userSketches = sketchesByUserId.get(user.id_user) || [];
      
      let totalAttemptsByOthers = 0;
      let successfulAttemptsByOthers = 0;
      let attemptedSketchesCount = 0;

      
      for (const sketch of userSketches) {
        const attempts = (sketch as any).Attempts || [];
        // Filtriamo per considerare solo i tentativi fatti dagli ALTRI utenti
        const attemptsByOthers = attempts.filter((a: any) => a.id_user !== user.id_user);

        if (attemptsByOthers.length === 0) {
          continue; // Nessuno ha ancora provato a indovinare questo sketch, lo ignoriamo
        }

        attemptedSketchesCount++;

        // Mappa per tracciare lo stato finale di ogni utente su questo sketch (userId -> hasGuessed)
        const attemptsByUser = new Map<number, boolean>();
        for (const a of attemptsByOthers) {
          const userId = a.id_user;
          if (!attemptsByUser.has(userId)) {
            attemptsByUser.set(userId, a.is_correct);
          } else if (a.is_correct && !attemptsByUser.get(userId)) {
            attemptsByUser.set(userId, true);
          }
        }

        // Ogni utente unico che ha partecipato conta come 1 tentativo complessivo per questo sketch
        totalAttemptsByOthers += attemptsByUser.size;

        // Contiamo quanti di questi utenti unici sono riusciti a indovinarlo
        for (const hasGuessed of attemptsByUser.values()) {
          if (hasGuessed) {
            successfulAttemptsByOthers++;
          }
        }
      }

      if (totalAttemptsByOthers === 0) {
        return {
          id_user: user.id_user,
          username: user.username,
          percentage: 0,
          total_attempts: 0,
          successful_attempts: 0,
          sketches_count: 0
        };
      }

      // Percentuale di successo dei disegni: quanti degli utenti che ci hanno provato hanno indovinato
      const percentage = Math.round((successfulAttemptsByOthers / totalAttemptsByOthers) * 100);

      return {
        id_user: user.id_user,
        username: user.username,
        percentage,
        total_attempts: totalAttemptsByOthers,
        successful_attempts: successfulAttemptsByOthers,
        sketches_count: attemptedSketchesCount
      };
    });

    // Filtriamo chi non ha mai ricevuto tentativi (evita spammer senza interazione)
    // e ordiniamo per percentuale decrescente (e per tentativi totali ricevuti come tie-breaker)
    return leaderboard
      .filter(item => item.total_attempts > 0)
      .sort((a, b) => b.percentage - a.percentage || b.total_attempts - a.total_attempts)
      .slice(0, 10);
  }
}
