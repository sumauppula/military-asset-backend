// src/controllers/expenditureController.js

const pool = require('../models/db');
const queries = require('../models/queries');

// Create a new expenditure
exports.createExpenditure = async (req, res) => {
  const { asset_id, base_id, quantity, date } = req.body;

  try {
    const result = await pool.query(queries.createExpenditure, [asset_id, base_id, quantity, date]);
    res.status(201).json({ message: 'Expenditure recorded', expenditure: result.rows[0] });
  } catch (error) {
    console.error('Error creating expenditure:', error);
    res.status(500).json({ error: 'Failed to record expenditure' });
  }
};

// Get all expenditures
exports.getAllExpenditures = async (req, res) => {
  try {
    const result = await pool.query(queries.getAllExpenditures);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching expenditures:', error);
    res.status(500).json({ error: 'Failed to fetch expenditures' });
  }
};
