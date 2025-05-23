const express = require('express');
const router = express.Router();
const logController = require('../controller/logController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// GET /api/logs - Admin only
router.get(
  '/',
  authenticateToken,
  authorizeRoles('Admin'),
  logController.getLogs
);

module.exports = router;
