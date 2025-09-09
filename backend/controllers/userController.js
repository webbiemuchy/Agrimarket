// backend/controllers/userController.js
const { prisma } = require('../config/database');

async function updateUserPublicKey(req, res, next) {
  try {
    const { publicKey } = req.body;
    if (!publicKey) return res.status(400).json({ message: 'Missing publicKey' });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { publicKey }
    });
    res.json({ message: 'Public key saved' });
  } catch (err) { next(err); }
}

async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, first_name: true, last_name: true, publicKey: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
}

module.exports = { updateUserPublicKey, getUserById };
