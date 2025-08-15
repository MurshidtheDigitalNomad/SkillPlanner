const pool = require('../db')
const bcrypt = require('bcryptjs');

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *
  `;
  const result = await pool.query(query, [name, email, hashedPassword]);
  return result.rows[0];
}

const authenticateUser = async (email, password) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  const user = result.rows[0];
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;

  // Don't return password_hash
  const { password_hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

module.exports = {
  createUser,
  authenticateUser
}
