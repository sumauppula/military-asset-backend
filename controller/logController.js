const queries = require('../models/queries');

const getLogs = async (req, res) => {
  try {
    const logs = await queries.getLogs(); // Assumes logs are stored in a `logs` table
    res.json(logs);
  } catch (error) {
    console.error('Log fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLogs };
