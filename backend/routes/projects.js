// backend/routes/projects.js
const router = require('express').Router();
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');
const pc = require('../controllers/projectController');

router.get('/', optionalAuth, pc.getProjects);
router.get('/:id', optionalAuth, pc.getProjectById);
router.get('/farmer/my-projects', authenticateToken, authorize('farmer'), pc.getFarmerProjects);
router.post('/', authenticateToken, authorize('farmer'), pc.createProject);
router.put('/:id', authenticateToken, pc.updateProject);
router.delete('/:id', authenticateToken, pc.deleteProject);
router.patch('/:id/status', authenticateToken, authorize('admin'), pc.updateProjectStatus);
router.get('/:id/analysis', authenticateToken, pc.getProjectWithAnalysis);

module.exports = router;
