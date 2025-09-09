// backend/routes/ai.js
const express = require('express');
const {
  analyzeProject,
  getClimateData,
  summarizeText,
  classifyProject,
  batchAnalyzeProjects
} = require('../controllers/aiController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();


router.post('/analyze/:projectId', authenticateToken, analyzeProject);
router.post('/batch-analyze', authenticateToken, authorize('admin'), batchAnalyzeProjects);


router.get('/climate', getClimateData);


router.post('/summarize', authenticateToken, summarizeText);
router.post('/classify', authenticateToken, classifyProject);

module.exports = router;

