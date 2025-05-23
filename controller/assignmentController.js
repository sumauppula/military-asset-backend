const queries = require('../models/queries');

const createAssignment = async (req, res) => {
  try {
    const { base_id, asset_type_id, quantity, assigned_to, assignment_date } = req.body;

    if (!base_id || !asset_type_id || !quantity || !assigned_to || !assignment_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assignment = await queries.createAssignment(
      base_id,
      asset_type_id,
      quantity,
      assigned_to,
      assignment_date
    );

    res.status(201).json({ message: 'Asset assigned successfully', assignment });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createAssignment };
