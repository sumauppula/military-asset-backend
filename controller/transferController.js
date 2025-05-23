// controller/transferController.js
const db = require('../models/db'); // Adjust if you're using pg or another DB module

// CREATE Transfer
exports.createTransfer = async (req, res) => {
  const { asset_id, from_base_id, to_base_id, quantity, date } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO transfers (asset_id, from_base_id, to_base_id, quantity, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [asset_id, from_base_id, to_base_id, quantity, date]
    );
    res.status(201).json({ message: 'Transfer created', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating transfer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET All Transfers
exports.getTransfers = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM transfers ORDER BY date DESC`);
    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching transfers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET Transfer by ID
exports.getTransferById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`SELECT * FROM transfers WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching transfer by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE Transfer
exports.updateTransfer = async (req, res) => {
  const { id } = req.params;
  const { asset_id, from_base_id, to_base_id, quantity, date } = req.body;

  try {
    const result = await db.query(
      `UPDATE transfers
       SET asset_id = $1, from_base_id = $2, to_base_id = $3, quantity = $4, date = $5
       WHERE id = $6 RETURNING *`,
      [asset_id, from_base_id, to_base_id, quantity, date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    res.status(200).json({ message: 'Transfer updated', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating transfer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE Transfer
exports.deleteTransfer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`DELETE FROM transfers WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    res.status(200).json({ message: 'Transfer deleted successfully' });
  } catch (err) {
    console.error('Error deleting transfer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};








