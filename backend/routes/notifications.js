const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const nc = require('../controllers/notificationController');

router.use(authenticateToken);
router.get('/', nc.listNotifications);
router.patch('/:id/read', nc.markAsRead);
router.patch('/mark-all-read', nc.markAllRead);

module.exports = router;
