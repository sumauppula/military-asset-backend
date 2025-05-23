const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');
const authorizeRoles = require('../middlewares/roleMiddleware');
const authenticate = require('../middlewares/authMiddleware');

// Only Admin and Base Commanders can view dashboard
router.get(
  '/',
  authenticate,
  authorizeRoles(['admin', 'commander']),
  dashboardController.getDashboardStats
);

module.exports = router;
