//backend/routes/investments.js
const express = require('express');
const {
  createInvestment,
  processPayment,
  getInvestorInvestments,
  getInvestmentById,
  getProjectInvestments
} = require('../controllers/investmentController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();


router.post('/', authenticateToken, authorize('investor'), createInvestment);
router.post('/process-payment', authenticateToken, authorize('investor'), processPayment);
router.get('/my-investments', authenticateToken, authorize('investor'), getInvestorInvestments);
router.get('/:id', authenticateToken, getInvestmentById);


router.get('/project/:projectId', authenticateToken, getProjectInvestments);

module.exports = router;

