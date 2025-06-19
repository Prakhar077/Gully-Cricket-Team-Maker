const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.SUPER_ADMIN_USERNAME &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: 'SUPER_ADMIN' }, process.env.JWT_SECRET);
    return res.json({ token, role: 'SUPER_ADMIN' });
  }

  const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ role: 'ADMIN', id: user.id }, process.env.JWT_SECRET);
  res.json({ token, role: 'ADMIN' });
};