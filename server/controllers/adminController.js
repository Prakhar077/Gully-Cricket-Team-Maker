const bcrypt = require('bcryptjs');
const pool = require('../db');

exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO admins (username, password) VALUES ($1, $2)', [username, hashed]);
  res.json({ message: 'Admin created' });
};

exports.getAdmins = async (req, res) => {
  const result = await pool.query('SELECT * FROM admins');
  res.json(result.rows);
};

exports.deleteAdmin = async (req, res) => {
  await pool.query('DELETE FROM admins WHERE id = $1', [req.params.id]);
  res.json({ message: 'Deleted' });
};