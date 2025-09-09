// frontend/src/hooks/useChat.js
import { useContext } from 'react';
import { ChatContext } from '../contexts/chatContextObj';

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (ctx === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return ctx;
};
