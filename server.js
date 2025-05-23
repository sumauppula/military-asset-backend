require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const queries = require('./models/queries'); // DB queries

// Import your route files
const assetRoutes = require('./routes/assetRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoute = require('./routes/transferRoute');
const assignmentRoute = require('./routes/assignmentRoute');
const expenditureRoute = require('./routes/expenditureRoute');

// Middleware
app.use(cors());
app.use(express.json());

// Test route for purchases to quickly check route is working
app.post('/api/purchases/test', (req, res) => {
  console.log('✅ /api/purchases/test route hit');
  res.json({ message: 'Test route works' });
});

// All Routes
app.use('/api/assets', assetRoutes);
app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/transfer', transferRoute);
app.use('/api/assignments',assignmentRoute);
app.use('/api/expenditures', expenditureRoute);

// 404 Route (if no matching route)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await queries.createTablesIfNotExist();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to create tables:', error);
    process.exit(1);
  }
})();







