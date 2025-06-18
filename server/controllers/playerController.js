const pool = require('../db');

exports.createPlayer = async (req, res) => {
  const { name, role, score, createdBy } = req.body;
  await pool.query(
    'INSERT INTO players (name, role, score, created_by) VALUES ($1, $2, $3, $4)',
    [name, role, score, createdBy]
  );
  res.json({ message: 'Player added' });
};

exports.getPlayers = async (req, res) => {
  const result = await pool.query('SELECT * FROM players');
  res.json(result.rows);
};



exports.deletePlayer = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM players WHERE id = $1", [id]);
    res.json({ message: "Player deleted" });
  } catch (err) {
    console.error("Error deleting player:", err);
    res.status(500).json({ message: "Failed to delete player" });
  }
};

exports.generateTeams = async (req, res) => {
  try {
    const { selectedPlayerIds } = req.body;
if (!selectedPlayerIds || !Array.isArray(selectedPlayerIds) || selectedPlayerIds.length < 2) {
  return res.status(400).json({ message: "At least 2 selected players are required." });
}

const result = await pool.query(
  'SELECT * FROM players WHERE id = ANY($1::int[])',
  [selectedPlayerIds]
);

    const players = result.rows;

    if (players.length < 2) {
      return res.status(400).json({ message: "Not enough players to form teams." });
    }

    // Sort players by score (desc)
    players.sort((a, b) => b.score - a.score);
    const best = players[0];
    const secondBest = players[1];

    const teamA = [best]; // Best scorer
    const teamB = [secondBest]; // Second best
    let sumA = best.score;
    let sumB = secondBest.score;

    // Group remaining players by role (excluding best and secondBest)
    const roles = { batter: [], bowler: [], allrounder: [] };
    for (let i = 2; i < players.length; i++) {
      const role = players[i].role.toLowerCase();
      if (roles[role]) roles[role].push(players[i]);
    }

    const assignByRole = (list) => {
      list.sort((a, b) => b.score - a.score);
      for (let i = 0; i < list.length; i += 2) {
        const pair = list.slice(i, i + 2);
        if (pair.length === 2) {
          if (sumA <= sumB) {
            teamA.push(pair[0]);
            teamB.push(pair[1]);
            sumA += pair[0].score;
            sumB += pair[1].score;
          } else {
            teamA.push(pair[1]);
            teamB.push(pair[0]);
            sumA += pair[1].score;
            sumB += pair[0].score;
          }
        } else if (pair.length === 1) {
          if (teamA.length <= teamB.length) {
            teamA.push(pair[0]);
            sumA += pair[0].score;
          } else {
            teamB.push(pair[0]);
            sumB += pair[0].score;
          }
        }
      }
    };

    assignByRole(roles.batter);
    assignByRole(roles.bowler);
    assignByRole(roles.allrounder);

    // Ensure team sizes match exactly
    while (teamA.length > teamB.length) {
      const p = teamA.pop();
      teamB.push(p);
      sumA -= p.score;
      sumB += p.score;
    }
    while (teamB.length > teamA.length) {
      const p = teamB.pop();
      teamA.push(p);
      sumB -= p.score;
      sumA += p.score;
    }

    return res.json({ teamA, teamB });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error generating teams", error: err.message });
  }
};










