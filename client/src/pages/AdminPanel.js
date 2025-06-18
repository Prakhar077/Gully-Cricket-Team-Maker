import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admins", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAdmins(res.data);
    } catch (err) {
      alert("Unauthorized or error fetching admins.");
      navigate("/login");
    }
  };

  const createAdmin = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admins",
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsername("");
      setPassword("");
      fetchAdmins();
    } catch (err) {
      alert("Error creating admin.");
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAdmins();
    } catch (err) {
      alert("Error deleting admin.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Super Admin Panel</h1>
        <button onClick={handleLogout} className="bg-gray-700 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={createAdmin}>
          Add Admin
        </button>
      </div>

      <ul className="mt-4">
        {admins.map((admin) => (
          <li key={admin.id} className="flex justify-between items-center border-b py-2">
            <span>{admin.username}</span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteAdmin(admin.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
