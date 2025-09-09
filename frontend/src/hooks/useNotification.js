// frontend/src/hooks/useNotification.js
import { useContext } from 'react';
import { NotificationContext } from '../contexts/notificationContextObj';

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (ctx === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return ctx;
};
