// src/routes/expenditureRoutes.js

const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');

// POST /api/expenditures
router.post('/', expenditureController.createExpenditure);

// GET /api/expenditures
router.get('/', expenditureController.getAllExpenditures);

module.exports = router;
