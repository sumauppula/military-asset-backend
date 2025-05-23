const queries = require('../models/queries');

// Create a purchase
const createPurchase = async (req, res) => {
  try {
    const { base_id, asset_type_id, quantity, purchase_date } = req.body;
    
    if (!base_id || !asset_type_id || !quantity || !purchase_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const purchase = await queries.createPurchase(base_id, asset_type_id, quantity, purchase_date);
    res.status(201).json(purchase);
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all purchases with optional filters
const getPurchases = async (req, res) => {
  try {
    const filters = req.query; // base_id, asset_type_id, start_date, end_date
    const purchases = await queries.getPurchases(filters);
    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get purchase by id
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchases = await queries.getPurchases({ id });
    
    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.json(purchases[0]);
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a purchase by id
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { base_id, asset_type_id, quantity, purchase_date } = req.body;
    
    const updatedPurchase = await queries.updatePurchase(id, {
      base_id,
      asset_type_id,
      quantity,
      purchase_date
    });
    
    if (!updatedPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.json(updatedPurchase);
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete purchase by id
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPurchase = await queries.deletePurchase(id);
    
    if (!deletedPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Delete purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};

