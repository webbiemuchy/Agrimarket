// backend/controllers/notificationController.js

const { prisma } = require('../config/database');



async function listNotifications(req, res, next) {
  try {
    const userId = req.user.id;

    const notes = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    
    res.json({ notifications: notes });
  } catch (error) {
    next(error);
  }
}


async function markAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const notifId = req.params.id;

    const notification = await prisma.notification.findUnique({
      where: { id: notifId }
    });

    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.update({
      where: { id: notifId },
      data: { is_read: true }
    });

    
    req.app.locals.io.to(`user_${userId}`).emit('notificationRead', { id: notifId });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}


async function markAllRead(req, res, next) {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true }
    });

    req.app.locals.io.to(`user_${userId}`).emit('allNotificationsRead');

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}


async function createNotification(req, res, next) {
  try {
    const userId = req.user.id;
    const { title, message, type } = req.body;

    const note = await prisma.notification.create({
      data: {
        user_id: userId,
        title,
        message,
        type
      }
    });

    
    req.app.locals.io.to(`user_${userId}`).emit('newNotification', note);

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listNotifications,
  markAsRead,
  markAllRead,
  createNotification
};
