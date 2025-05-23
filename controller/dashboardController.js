const queries = require('../models/queries');

const getDashboardStats = async (req, res) => {
  try {
    const { base_id, start_date, end_date, asset_type_id } = req.query;

    const stats = await queries.getDashboardStats({
      base_id,
      start_date,
      end_date,
      asset_type_id
    });

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
};
