const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchaseController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// ✅ Combine into one POST route
router.post(
  '/',
  (req, res, next) => {
    console.log('✅ Purchase POST route hit');
    next();
  },
  authenticateToken,
  authorizeRoles('Admin', 'Logistics Officer'),
  purchaseController.createPurchase
);

// ✅ Other routes remain unchanged
router.get(
  '/',
  authenticateToken,
  authorizeRoles('Admin', 'Base Commander', 'Logistics Officer'),
  purchaseController.getPurchases
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'Base Commander', 'Logistics Officer'),
  purchaseController.getPurchaseById
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'Logistics Officer'),
  purchaseController.updatePurchase
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  purchaseController.deletePurchase
);

module.exports = router;





// const express = require('express');
// const router = express.Router();

// // Simple test POST route to check purchases routing
// router.post('/test', (req, res) => {
//   console.log('✅ purchaseRoutes test route hit');
//   res.json({ message: 'Purchase routes test works' });
// });

// Your other purchase routes here, e.g.:
// router.post('/', authenticateToken, authorizeRoles(...), purchaseController.createPurchase);

//module.exports = router;




// const express = require('express');
// const router = express.Router();

// // ✅ Basic test route
// router.post('/test', (req, res) => {
//   console.log('✅ /api/purchases/test route hit');
//   res.json({ message: 'Purchase route test works' });
// });

// module.exports = router;



