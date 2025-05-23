const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignmentController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// POST /api/assignments - Protected (Admin, Base Commander, Logistics Officer)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('Admin', 'Base Commander', 'Logistics Officer'),
  assignmentController.createAssignment
);

module.exports = router;