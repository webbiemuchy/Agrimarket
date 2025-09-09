// frontend/src/contexts/NotificationProvider.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { NotificationContext } from "./notificationContextObj";
import { useAuth } from "../hooks/useAuth";
import notificationService from "../services/notificationService";
import { io } from "socket.io-client";

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notifications");
    return stored ? JSON.parse(stored) : [];
  });
  const [allNotifications, setAllNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const socketRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationService.fetchNotifications();
      const mapped = data.map((n) => ({
        ...n,
        read: n.is_read,
        timestamp: n.created_at || n.timestamp,
      }));
      setNotifications(mapped.filter((n) => !n.read));
      setAllNotifications(
        mapped.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    loadNotifications();

   
    socketRef.current = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        withCredentials: true,
      }
    );
    socketRef.current.emit("joinUser", user.id);

    socketRef.current.on("newNotification", (n) => {
      const mapped = {
        ...n,
        read: n.is_read,
        timestamp: n.created_at || n.timestamp,
      };
      setNotifications((prev) => [mapped, ...prev]);
      setAllNotifications((prev) => [mapped, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, loadNotifications]);

  
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const showNotification = async (
    title,
    message,
    type = "info",
    isBellNotification = false
  ) => {
    if (isBellNotification && user) {
      
      const tempId = Date.now().toString();
      const temp = {
        id: tempId,
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [temp, ...prev]);
      setAllNotifications((prev) => [temp, ...prev]);

      try {
        const created = await notificationService.createNotification({
          userId: user.id,
          title,
          message,
          type,
        });
       
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === tempId
              ? {
                  ...created,
                  read: created.is_read,
                  timestamp: created.created_at,
                }
              : n
          )
        );
        setAllNotifications((prev) =>
          prev.map((n) =>
            n.id === tempId
              ? {
                  ...created,
                  read: created.is_read,
                  timestamp: created.created_at,
                }
              : n
          )
        );
      } catch (err) {
        console.error("Failed to create notification", err);
        setNotifications((prev) => prev.filter((n) => n.id !== tempId));
        setAllNotifications((prev) => prev.filter((n) => n.id !== tempId));
      }
    }

    Swal.fire({
      title,
      text: message,
      icon: type,
      toast: true,
      position: "center",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  };

  const markNotificationAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationService.markNotificationAsRead(id);
    } catch (err) {
      console.error("Failed to mark read", err);
    
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all read", err);
     
      setNotifications((prev) => prev.map((n) => ({ ...n, read: false })));
      setAllNotifications((prev) => prev.map((n) => ({ ...n, read: false })));
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        allNotifications,
        showNotification,
        markNotificationAsRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
