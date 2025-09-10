const pool = require('../db');

const createPasswordResetToken = async (userId, token, expiresAt) => {
  const query = `
    INSERT INTO password_resets (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, token, expiresAt];
  const result = await pool.query(query, values);
  return result.rows[0];
};


const findUserByEmail = async (email) => {
  const query = `SELECT id, email FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findPasswordResetToken = async (token) => {
  const query = `
    SELECT pr.*, u.id as user_id, u.email 
    FROM password_resets pr 
    JOIN users u ON pr.user_id = u.id 
    WHERE pr.token = $1 AND pr.expires_at > NOW()
  `;
  const result = await pool.query(query, [token]);
  return result.rows[0];
};

const updateUserPassword = async (userId, hashedPassword) => {
  const query = `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email`;
  const result = await pool.query(query, [hashedPassword, userId]);
  return result.rows[0];
};

const deletePasswordResetToken = async (token) => {
  const query = `DELETE FROM password_resets WHERE token = $1`;
  await pool.query(query, [token]);
};

module.exports={createPasswordResetToken, findUserByEmail, findPasswordResetToken, updateUserPassword, deletePasswordResetToken}