// frontend/src/services/notificationService.js
import api from './api';

export async function fetchNotifications() {
  
   const response = await api.get('/notifications', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.notifications;
}

export async function markNotificationAsRead(notificationId) {
  try {
    await api.patch(`/notifications/${notificationId}/read`,{
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw new Error('Could not update notification status');
  }
}

export async function markAllNotificationsRead() {
  try {
    await api.patch('/notifications/mark-all-read', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return true; 
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw new Error('Could not update notifications status');
  }
}

export async function createNotification(data) {
  
  const response = await api.post('/notifications', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
}


export async function subscribeToPush(subscription) {
  const response = await api.post('/notifications/subscribe', subscription);
  return response.data;
}

export default {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
  createNotification,
  subscribeToPush,
};
