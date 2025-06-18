import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import PlayerForm from "./pages/PlayerForm";
import TeamPage from "./pages/TeamPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/players" element={<PlayerForm />} />
        <Route path="/teams" element={<TeamPage />} />
      </Routes>
    </Router>
  );
}

export default App;