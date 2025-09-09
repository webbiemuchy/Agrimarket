import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import AllNotificationsModal from './AllNotificationsModal';

const NotificationDropdown = () => {
  const {
    unreadCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    allNotifications,
  } = useNotification();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(notification => !notification.read);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'message': return <MessageCircle size={16} className="text-blue-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };
    const handleViewAllClick = (e) => {
    e.preventDefault(); 
    setIsOpen(false); 
    setIsModalOpen(true); 
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllNotificationsRead}
                className="text-sm text-emerald-600 hover:text-emerald-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              unreadNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer bg-blue-50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(notification.timestamp || notification.created_at)}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 text-center">
            <a 
              href="#"
               onClick={handleViewAllClick}
              className="text-sm text-emerald-600 hover:text-emerald-800"
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
      {isModalOpen && (
        <AllNotificationsModal 
          notifications={allNotifications} 
          onClose={() => setIsModalOpen(false)}
          markNotificationAsRead={markNotificationAsRead}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;