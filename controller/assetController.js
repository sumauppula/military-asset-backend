const queries = require('../models/queries');
const logger = require('../utils/logger');

// Get all available assets
const getAllAssets = async (req, res) => {
  try {
    const assets = await queries.getAllAssets();
    res.json(assets);
  } catch (error) {
    console.error('Get Assets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new asset purchase
const createPurchase = async (req, res) => {
  try {
    const { base_id, asset_type_id, quantity, purchase_date } = req.body;

    if (!base_id || !asset_type_id || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const purchase = await queries.createPurchase(
      base_id,
      asset_type_id,
      quantity,
      purchase_date || new Date()
    );

    await logger.log(req.user.id, 'CREATE_PURCHASE', JSON.stringify(purchase));
    res.status(201).json(purchase);
  } catch (error) {
    console.error('Create Purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get purchases with optional filters
const getPurchases = async (req, res) => {
  try {
    const filters = {
      base_id: req.query.base_id,
      asset_type_id: req.query.asset_type_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const purchases = await queries.getPurchases(filters);
    res.json(purchases);
  } catch (error) {
    console.error('Get Purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new asset transfer
const createTransfer = async (req, res) => {
  try {
    const { from_base_id, to_base_id, asset_type_id, quantity, transfer_date } = req.body;

    if (!from_base_id || !to_base_id || !asset_type_id || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transfer = await queries.createTransfer(
      from_base_id,
      to_base_id,
      asset_type_id,
      quantity,
      transfer_date || new Date()
    );

    await logger.log(req.user.id, 'CREATE_TRANSFER', JSON.stringify(transfer));
    res.status(201).json(transfer);
  } catch (error) {
    console.error('Create Transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get transfers with optional filters
const getTransfers = async (req, res) => {
  try {
    const filters = {
      base_id: req.query.base_id,
      asset_type_id: req.query.asset_type_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const transfers = await queries.getTransfers(filters);
    res.json(transfers);
  } catch (error) {
    console.error('Get Transfers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAssets,
  createPurchase,
  getPurchases,
  createTransfer,
  getTransfers,
};

