// backend/routes/dashboard.js
const express = require('express');
const {
  getInvestorDashboard,
  getFarmerDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Dashboard routes
router.get('/investor', authenticateToken, authorize('investor'), getInvestorDashboard);
router.get('/farmer', authenticateToken, authorize('farmer'), getFarmerDashboard);
router.get('/admin', authenticateToken, authorize('admin'), getAdminDashboard);

module.exports = router;

