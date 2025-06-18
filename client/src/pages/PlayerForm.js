import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlayerForm = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("batter");
  const [score, setScore] = useState("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await axios.get("https://gully-cricket-team-maker.onrender.com/api/players", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPlayers(res.data);
    } catch (error) {
      console.error("Failed to fetch players", error);
    }
  };

  const handleAddPlayer = async () => {
    if (!name || !role || !score) {
      return alert("All fields are required.");
    }

    try {
      await axios.post(
        "https://gully-cricket-team-maker.onrender.com/api/players",
        {
          name,
          role,
          score: parseFloat(score),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setName("");
      setRole("batter");
      setScore("");
      fetchPlayers();
    } catch (error) {
      alert("Error adding player. Maybe name already exists.");
    }
  };

const handleDeletePlayer = async (id) => {
  try {
    await axios.delete(`https://gully-cricket-team-maker.onrender.com/api/players/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchPlayers(); // Refresh list
  } catch (error) {
    alert("Failed to delete player");
  }
};


const handleCheckboxChange = (playerId) => {
  setSelectedPlayerIds((prev) =>
    prev.includes(playerId)
      ? prev.filter((id) => id !== playerId)
      : [...prev, playerId]
  );
};


useEffect(() => {
  localStorage.setItem("selectedPlayerIds", JSON.stringify(selectedPlayerIds));
}, [selectedPlayerIds]);



  const handleGenerateTeams = async () => {
    if (selectedPlayerIds.length < 2) {
      return alert("Please select at least 2 players to generate teams.");
    }

    try {
      const res = await axios.post(
        "https://gully-cricket-team-maker.onrender.com/api/players/generate",
        { selectedPlayerIds }, // send selected IDs
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.setItem("generatedTeams", JSON.stringify(res.data)); // optional
      navigate("/teams");
    } catch (error) {
      console.error("Error generating teams", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Players</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="batter">Batter</option>
          <option value="bowler">Bowler</option>
          <option value="allrounder">Allrounder</option>
        </select>
        <input
          className="border p-2 rounded"
          type="number"
          step="0.1"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mr-3"
          onClick={handleAddPlayer}
        >
          Add Player
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleGenerateTeams}
        >
          Generate Teams
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">Current Players</h3>
     <ul className="space-y-1">
  {players.map((player,idx) => (
    <li
  key={idx}
  className="bg-gray-100 p-2 rounded flex justify-between items-center"
>
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={selectedPlayerIds.includes(player.id)}
      onChange={() => handleCheckboxChange(player.id)}
    />
    <span>
      {player.name} ({player.role})
    </span>
  </label>
  <div className="flex items-center gap-4">
    <span>Score: {player.score}</span>
    <button
      onClick={() => handleDeletePlayer(player.id)}
      className="bg-red-500 text-white px-2 py-1 rounded"
    >
      Delete
    </button>
  </div>
</li>

  ))}
</ul>

    </div>
  );
};

export default PlayerForm;
