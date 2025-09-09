// backend/routes/chat.js
const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const { getChat, postChatMessage, getConversations } = require('../controllers/chatController');

router.use(authenticateToken);
router.get('/:id', getChat);
router.post('/:id', postChatMessage);
router.get('/', getConversations)

module.exports = router;
