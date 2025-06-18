import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://gully-cricket-team-maker.onrender.com/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      if (res.data.role === "SUPER_ADMIN") navigate("/admin");
      else navigate("/players");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input placeholder="Username" className="border p-2 w-full mb-2" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full mb-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </div>
  );
};

export default Login;