// backend/routes/user.js
const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const { updateUserPublicKey, getUserById } = require('../controllers/userController');

router.use(authenticateToken);
router.put('/me/publicKey', updateUserPublicKey);
router.get('/:id', getUserById);

module.exports = router;
