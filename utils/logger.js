const db = require('../models/db');

const log = async (user_id, action, metadata) => {
  await db.query(
    `INSERT INTO logs (user_id, action, metadata, timestamp)
     VALUES ($1, $2, $3, NOW())`,
    [user_id, action, metadata]
  );
};

module.exports = {
  log,
};
