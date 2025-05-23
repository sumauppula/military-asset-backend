// const express = require('express');
// const router = express.Router();
// const transferController = require('../controller/transferController');

// // ✅ Confirm this route file is being loaded
// console.log('✅ transferRoute file loaded');

// // ✅ Test route to verify this file and endpoint work
// router.get('/test', (req, res) => {
//   console.log('✅ /api/transfers/test hit');
//   res.json({ message: 'Transfer test route works' });
// });

// // ✅ Main transfer routes
// router.post('/', transferController.createTransfer);
// router.get('/', transferController.getTransfers);
// router.get('/:id', transferController.getTransferById);
// router.put('/:id', transferController.updateTransfer);
// router.delete('/:id', transferController.deleteTransfer);

// module.exports = router;



// routes/transferRoute.js

const express = require('express');
const router = express.Router();
const transferController = require('../controller/transferController');
const authenticateToken = require('../middlewares/authMiddleware');

// ✅ Confirm the route file is loaded
console.log('✅ transferRoute file loaded');

// ✅ Test route
router.get('/test', (req, res) => {
  console.log('✅ /api/transfers/test hit');
  res.json({ message: 'Transfer test route works' });
});

// ✅ Apply authentication middleware to all routes
router.use(authenticateToken);

// ✅ Transfer CRUD Routes

// Create a new transfer
router.post('/', transferController.createTransfer);

// Get all transfers
router.get('/', transferController.getTransfers);

// Get a specific transfer by ID
router.get('/:id', transferController.getTransferById);

// Update a transfer by ID
router.put('/:id', transferController.updateTransfer);

// Delete a transfer by ID
router.delete('/:id', transferController.deleteTransfer);

module.exports = router;
