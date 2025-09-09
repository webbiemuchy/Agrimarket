
// frontend/src/contexts/chatContextObj.js
import { createContext } from 'react';

export const ChatContext = createContext({
  activeConversation: null,
  conversations: [],
  unreadCount: 0,
  startChat: () => {},
  loadConversations: () => {},
  markAsRead: () => {}
});