const express = require('express');
const router = express.Router();
const assetController = require('../controller/assetController');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

// GET /assets
router.get('/assets', authenticate, assetController.getAllAssets);

// Purchases
router.post('/purchase', authenticate, authorize(['Admin', 'LogisticsOfficer']), assetController.createPurchase);
router.get('/purchases', authenticate, assetController.getPurchases);

// Transfers
router.post('/transfers', authenticate, authorize(['Admin', 'LogisticsOfficer']), assetController.createTransfer);
router.get('/transfers', authenticate, assetController.getTransfers);

module.exports = router;

