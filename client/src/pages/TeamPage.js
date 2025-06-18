// src/pages/TeamPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

const TeamPage = () => {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const navigate = useNavigate(); // ✅

useEffect(() => {
  const fetchTeams = async () => {
    try {
      const selectedIds = JSON.parse(localStorage.getItem("selectedPlayerIds") || "[]");

      const res = await axios.post(
        "http://localhost:5000/api/players/generate",
        { selectedPlayerIds: selectedIds }, // Proper body
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTeamA(res.data.teamA);
      setTeamB(res.data.teamB);
    } catch (error) {
      console.error("Error fetching teams", error);
    }
  };
  fetchTeams();
}, []);


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center w-full">Generated Teams</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded absolute right-6"
          onClick={() => navigate("/players")} // ✅ Navigate to form route
        >
          Add Player
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Team A</h3>
          <ul className="bg-white shadow-md rounded p-4 space-y-2">
            {teamA.map((p, idx) => (
              <li key={idx} className="flex justify-between border-b pb-1">
                <span>{p.name} ({p.role})</span>
                <span>{p.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Team B</h3>
          <ul className="bg-white shadow-md rounded p-4 space-y-2">
            {teamB.map((p, idx) => (
              <li key={idx} className="flex justify-between border-b pb-1">
                <span>{p.name} ({p.role})</span>
                <span>{p.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
