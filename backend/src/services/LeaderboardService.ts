import { User, Attempt, Sketch } from "../config/database.js";
import { Sequelize } from "sequelize";

export class LeaderboardService {
  
  // Classifica dei migliori giocatori (in base alle parole indovinate)
  static async getPlayerLeaderboard() {
    const players = await User.findAll({
      subQuery: false, // Evita la query di paginazione nidificata che rompe SQLite
      attributes: [
        "id_user",
        "username",
        [Sequelize.fn("COUNT", Sequelize.col("Attempts.id_attempt")), "score"]
      ],
      include: [{
        model: Attempt,
        attributes: [],
        where: { is_correct: true },
        required: true // Mostra solo chi ha indovinato almeno 1 parola
      }],
      group: ["User.id_user", "User.username"],
      order: [[Sequelize.literal("score"), "DESC"]],
      limit: 10
    });

    return players.map((p: any) => ({
      id_user: p.id_user,
      username: p.username,
      score: parseInt(p.getDataValue("score") || "0", 10)
    }));
  }

  // Classifica dei migliori disegnatori (in base alla % di sketch indovinati dagli altri utenti)
  static async getArtistLeaderboard() {
    const allUsers = await User.findAll({ attributes: ["id_user", "username"] });

    const sketches = await Sketch.findAll({
      include: [
        {
          model: Attempt,
          where: { is_correct: true },
          required: false // LEFT JOIN per prendere anche sketch non ancora indovinati
        }
      ]
    });

    const leaderboard = allUsers.map((user: any) => {
      const userSketches = sketches.filter((s: any) => s.id_user === user.id_user);
      const totalSketches = userSketches.length;

      if (totalSketches === 0) {
        return {
          id_user: user.id_user,
          username: user.username,
          percentage: 0,
          sketches_count: 0
        };
      }

      // Conta gli sketch dell'utente che sono stati indovinati da altri
      const guessedSketchesCount = userSketches.filter((s: any) => {
        const attempts = s.Attempts || [];
        return attempts.some((a: any) => a.is_correct && a.id_user !== user.id_user);
      }).length;

      const percentage = Math.round((guessedSketchesCount / totalSketches) * 100);

      return {
        id_user: user.id_user,
        username: user.username,
        percentage,
        sketches_count: totalSketches
      };
    });

    // Filtra chi non ha mai disegnato ed ordina per percentuale decrescente (e per numero di sketch in caso di parità)
    return leaderboard
      .filter(item => item.sketches_count > 0)
      .sort((a, b) => b.percentage - a.percentage || b.sketches_count - a.sketches_count)
      .slice(0, 10);
  }
}
