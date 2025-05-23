const db = require('./db');

// ====================
// TABLE CREATION
// ====================
const createTablesIfNotExist = async () => {
  const createTablesQueries = [
    `CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      role_name VARCHAR(50) UNIQUE NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS bases (
      id SERIAL PRIMARY KEY,
      base_name VARCHAR(100) UNIQUE NOT NULL,
      location VARCHAR(100)
    );`,
    `CREATE TABLE IF NOT EXISTS asset_types (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER REFERENCES roles(id),
      base_id INTEGER REFERENCES bases(id)
    );`,
    `CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      base_id INTEGER REFERENCES bases(id),
      asset_type_id INTEGER REFERENCES asset_types(id),
      quantity INTEGER NOT NULL,
      purchase_date DATE NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS transfers (
      id SERIAL PRIMARY KEY,
      from_base_id INTEGER REFERENCES bases(id),
      to_base_id INTEGER REFERENCES bases(id),
      asset_type_id INTEGER REFERENCES asset_types(id),
      quantity INTEGER NOT NULL,
      transfer_date DATE NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS transaction_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      base_id INTEGER REFERENCES bases(id),
      asset_type_id INTEGER REFERENCES asset_types(id),
      quantity INTEGER NOT NULL,
      assigned_date DATE NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS expenditures (
      id SERIAL PRIMARY KEY,
      base_id INTEGER REFERENCES bases(id),
      asset_type_id INTEGER REFERENCES asset_types(id),
      quantity INTEGER NOT NULL,
      expenditure_date DATE NOT NULL,
      description TEXT
    );`
  ];

  for (const query of createTablesQueries) {
    await db.query(query);
  }
  console.log('✅ Tables created or already exist');
};

// ====================
// USER QUERIES
// ====================
const createUser = async (username, passwordHash, role_id, base_id) => {
  const res = await db.query(
    `INSERT INTO users (username, password_hash, role_id, base_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, role_id, base_id`,
    [username, passwordHash, role_id, base_id]
  );
  return res.rows[0];
};

const getUserByUsername = async (username) => {
  const res = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return res.rows[0];
};

const updateUser = async (id, { username, passwordHash, role_id, base_id }) => {
  const fields = [];
  const values = [];
  let count = 1;

  if (username) {
    fields.push(`username = $${count++}`);
    values.push(username);
  }
  if (passwordHash) {
    fields.push(`password_hash = $${count++}`);
    values.push(passwordHash);
  }
  if (role_id) {
    fields.push(`role_id = $${count++}`);
    values.push(role_id);
  }
  if (base_id) {
    fields.push(`base_id = $${count++}`);
    values.push(base_id);
  }

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${count} RETURNING *`;
  const res = await db.query(query, values);
  return res.rows[0];
};

const deleteUser = async (id) => {
  const res = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
  return res.rows[0];
};

// ====================
// PURCHASE QUERIES
// ====================
const createPurchase = async (base_id, asset_type_id, quantity, purchase_date) => {
  const res = await db.query(
    `INSERT INTO purchases (base_id, asset_type_id, quantity, purchase_date)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [base_id, asset_type_id, quantity, purchase_date]
  );
  return res.rows[0];
};

const getPurchases = async (filters = {}) => {
  let query = `SELECT p.*, a.name AS asset_name, b.base_name 
               FROM purchases p
               JOIN asset_types a ON p.asset_type_id = a.id
               JOIN bases b ON p.base_id = b.id
               WHERE 1=1`;
  const params = [];
  let count = 1;

  if (filters.base_id) {
    query += ` AND p.base_id = $${count}`;
    params.push(filters.base_id);
    count++;
  }
  if (filters.asset_type_id) {
    query += ` AND p.asset_type_id = $${count}`;
    params.push(filters.asset_type_id);
    count++;
  }
  if (filters.start_date) {
    query += ` AND p.purchase_date >= $${count}`;
    params.push(filters.start_date);
    count++;
  }
  if (filters.end_date) {
    query += ` AND p.purchase_date <= $${count}`;
    params.push(filters.end_date);
    count++;
  }

  query += ` ORDER BY p.purchase_date DESC`;
  const res = await db.query(query, params);
  return res.rows;
};

const updatePurchase = async (id, { base_id, asset_type_id, quantity, purchase_date }) => {
  const fields = [];
  const values = [];
  let count = 1;

  if (base_id) fields.push(`base_id = $${count++}`), values.push(base_id);
  if (asset_type_id) fields.push(`asset_type_id = $${count++}`), values.push(asset_type_id);
  if (quantity) fields.push(`quantity = $${count++}`), values.push(quantity);
  if (purchase_date) fields.push(`purchase_date = $${count++}`), values.push(purchase_date);

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE purchases SET ${fields.join(', ')} WHERE id = $${count} RETURNING *`;
  const res = await db.query(query, values);
  return res.rows[0];
};

const deletePurchase = async (id) => {
  const res = await db.query(`DELETE FROM purchases WHERE id = $1 RETURNING *`, [id]);
  return res.rows[0];
};

// ====================
// TRANSFER QUERIES
// ====================
const createTransfer = async (from_base_id, to_base_id, asset_type_id, quantity, transfer_date) => {
  const res = await db.query(
    `INSERT INTO transfers (from_base_id, to_base_id, asset_type_id, quantity, transfer_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [from_base_id, to_base_id, asset_type_id, quantity, transfer_date]
  );
  return res.rows[0];
};

const getTransfers = async (filters = {}) => {
  let query = `SELECT t.*, a.name AS asset_name, b1.base_name AS from_base, b2.base_name AS to_base 
               FROM transfers t
               JOIN asset_types a ON t.asset_type_id = a.id
               JOIN bases b1 ON t.from_base_id = b1.id
               JOIN bases b2 ON t.to_base_id = b2.id
               WHERE 1=1`;
  const params = [];
  let count = 1;

  if (filters.base_id) {
    query += ` AND (t.from_base_id = $${count} OR t.to_base_id = $${count})`;
    params.push(filters.base_id);
    count++;
  }
  if (filters.asset_type_id) {
    query += ` AND t.asset_type_id = $${count}`;
    params.push(filters.asset_type_id);
    count++;
  }
  if (filters.start_date) {
    query += ` AND t.transfer_date >= $${count}`;
    params.push(filters.start_date);
    count++;
  }
  if (filters.end_date) {
    query += ` AND t.transfer_date <= $${count}`;
    params.push(filters.end_date);
    count++;
  }

  query += ` ORDER BY t.transfer_date DESC`;
  const res = await db.query(query, params);
  return res.rows;
};

const updateTransfer = async (id, { from_base_id, to_base_id, asset_type_id, quantity, transfer_date }) => {
  const fields = [];
  const values = [];
  let count = 1;

  if (from_base_id) fields.push(`from_base_id = $${count++}`), values.push(from_base_id);
  if (to_base_id) fields.push(`to_base_id = $${count++}`), values.push(to_base_id);
  if (asset_type_id) fields.push(`asset_type_id = $${count++}`), values.push(asset_type_id);
  if (quantity) fields.push(`quantity = $${count++}`), values.push(quantity);
  if (transfer_date) fields.push(`transfer_date = $${count++}`), values.push(transfer_date);

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE transfers SET ${fields.join(', ')} WHERE id = $${count} RETURNING *`;
  const res = await db.query(query, values);
  return res.rows[0];
};

const deleteTransfer = async (id) => {
  const res = await db.query(`DELETE FROM transfers WHERE id = $1 RETURNING *`, [id]);
  return res.rows[0];
};

// ====================
// ASSIGNMENT QUERIES
// ====================
const createAssignment = async (base_id, asset_type_id, quantity, assigned_date) => {
  const res = await db.query(
    `INSERT INTO assignments (base_id, asset_type_id, quantity, assigned_date)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [base_id, asset_type_id, quantity, assigned_date]
  );
  return res.rows[0];
};

const getAssignments = async (filters = {}) => {
  let query = `SELECT a.*, at.name AS asset_name, b.base_name 
               FROM assignments a
               JOIN asset_types at ON a.asset_type_id = at.id
               JOIN bases b ON a.base_id = b.id
               WHERE 1=1`;
  const params = [];
  let count = 1;

  if (filters.base_id) {
    query += ` AND a.base_id = $${count}`;
    params.push(filters.base_id);
    count++;
  }
  if (filters.asset_type_id) {
    query += ` AND a.asset_type_id = $${count}`;
    params.push(filters.asset_type_id);
    count++;
  }
  if (filters.start_date) {
    query += ` AND a.assigned_date >= $${count}`;
    params.push(filters.start_date);
    count++;
  }
  if (filters.end_date) {
    query += ` AND a.assigned_date <= $${count}`;
    params.push(filters.end_date);
    count++;
  }

  query += ` ORDER BY a.assigned_date DESC`;
  const res = await db.query(query, params);
  return res.rows;
};

const updateAssignment = async (id, { base_id, asset_type_id, quantity, assigned_date }) => {
  const fields = [];
  const values = [];
  let count = 1;

  if (base_id) fields.push(`base_id = $${count++}`), values.push(base_id);
  if (asset_type_id) fields.push(`asset_type_id = $${count++}`), values.push(asset_type_id);
  if (quantity) fields.push(`quantity = $${count++}`), values.push(quantity);
  if (assigned_date) fields.push(`assigned_date = $${count++}`), values.push(assigned_date);

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE assignments SET ${fields.join(', ')} WHERE id = $${count} RETURNING *`;
  const res = await db.query(query, values);
  return res.rows[0];
};

const deleteAssignment = async (id) => {
  const res = await db.query(`DELETE FROM assignments WHERE id = $1 RETURNING *`, [id]);
  return res.rows[0];
};

// ====================
// EXPENDITURE QUERIES
// ====================
const createExpenditure = async (base_id, asset_type_id, quantity, expenditure_date, description) => {
  const res = await db.query(
    `INSERT INTO expenditures (base_id, asset_type_id, quantity, expenditure_date, description)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [base_id, asset_type_id, quantity, expenditure_date, description]
  );
  return res.rows[0];
};

const getExpenditures = async (filters = {}) => {
  let query = `SELECT e.*, a.name AS asset_name, b.base_name 
               FROM expenditures e
               JOIN asset_types a ON e.asset_type_id = a.id
               JOIN bases b ON e.base_id = b.id
               WHERE 1=1`;
  const params = [];
  let count = 1;

  if (filters.base_id) {
    query += ` AND e.base_id = $${count}`;
    params.push(filters.base_id);
    count++;
  }
  if (filters.asset_type_id) {
    query += ` AND e.asset_type_id = $${count}`;
    params.push(filters.asset_type_id);
    count++;
  }
  if (filters.start_date) {
    query += ` AND e.expenditure_date >= $${count}`;
    params.push(filters.start_date);
    count++;
  }
  if (filters.end_date) {
    query += ` AND e.expenditure_date <= $${count}`;
    params.push(filters.end_date);
    count++;
  }

  query += ` ORDER BY e.expenditure_date DESC`;
  const res = await db.query(query, params);
  return res.rows;
};

const updateExpenditure = async (id, { base_id, asset_type_id, quantity, expenditure_date, description }) => {
  const fields = [];
  const values = [];
  let count = 1;

  if (base_id) fields.push(`base_id = $${count++}`), values.push(base_id);
  if (asset_type_id) fields.push(`asset_type_id = $${count++}`), values.push(asset_type_id);
  if (quantity) fields.push(`quantity = $${count++}`), values.push(quantity);
  if (expenditure_date) fields.push(`expenditure_date = $${count++}`), values.push(expenditure_date);
  if (description) fields.push(`description = $${count++}`), values.push(description);

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE expenditures SET ${fields.join(', ')} WHERE id = $${count} RETURNING *`;
  const res = await db.query(query, values);
  return res.rows[0];
};

const deleteExpenditure = async (id) => {
  const res = await db.query(`DELETE FROM expenditures WHERE id = $1 RETURNING *`, [id]);
  return res.rows[0];
};

module.exports = {
  createTablesIfNotExist,

  // User
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser,

  // Purchase
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,

  // Transfer
  createTransfer,
  getTransfers,
  updateTransfer,
  deleteTransfer,

  // Assignment
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,

  // Expenditure
  createExpenditure,
  getExpenditures,
  updateExpenditure,
  deleteExpenditure,
};







// const db = require('../models/db');

// // 🔧 Create tables if not exist
// const createTablesIfNotExist = async () => {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bases (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(100) NOT NULL
//     );

//     CREATE TABLE IF NOT EXISTS asset_types (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(100) NOT NULL
//     );

//     CREATE TABLE IF NOT EXISTS transfers (
//       id SERIAL PRIMARY KEY,
//       from_base_id INTEGER REFERENCES bases(id),
//       to_base_id INTEGER REFERENCES bases(id),
//       asset_type_id INTEGER REFERENCES asset_types(id),
//       quantity INTEGER NOT NULL,
//       transfer_date DATE NOT NULL
//     );
//   `);
// };

// // ➕ Create a new transfer
// const createTransfer = async (from_base_id, to_base_id, asset_type_id, quantity, transfer_date) => {
//   const res = await db.query(
//     `INSERT INTO transfers (from_base_id, to_base_id, asset_type_id, quantity, transfer_date)
//      VALUES ($1, $2, $3, $4, $5)
//      RETURNING *`,
//     [from_base_id, to_base_id, asset_type_id, quantity, transfer_date]
//   );
//   return res.rows[0];
// };

// // 📥 Get all transfers
// const getTransfers = async () => {
//   const res = await db.query(`SELECT * FROM transfers`);
//   return res.rows;
// };

// // 🔍 Check available quantity of asset at a base
// const getAssetQuantityAtBase = async (base_id, asset_type_id) => {
//   const res = await db.query(
//     `SELECT COALESCE(SUM(
//         CASE
//           WHEN to_base_id = $1 THEN quantity
//           WHEN from_base_id = $1 THEN -quantity
//           ELSE 0
//         END
//       ), 0) AS total_quantity
//      FROM transfers
//      WHERE asset_type_id = $2`,
//     [base_id, asset_type_id]
//   );
//   return res.rows[0].total_quantity;
// };

// // Export all functions
// module.exports = {
//   createTablesIfNotExist,
//   createTransfer,
//   getTransfers,
//   getAssetQuantityAtBase,
// };
