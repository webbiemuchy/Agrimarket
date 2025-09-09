// frontend/src/contexts/ChatProvider.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatContext } from './chatContextObj';
import { io } from 'socket.io-client';
import * as openpgp from 'openpgp';
import { useAuth } from '../hooks/useAuth';
import { getConversations } from '../services/chatService';

export const ChatProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const socketRef = useRef(null);

  const unreadCount = conversations.filter(c => c.unread).length;

  
  const getPrivateKey = useCallback(async () => {
    
    if (!user) return null;

    let armored = localStorage.getItem('privateKey');
    if (!armored) {
      
      const { privateKey: privArmored, publicKey } = await openpgp.generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }],
        format: 'armored'
      });

      armored = privArmored;
      localStorage.setItem('privateKey', armored);

      
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/me/publicKey`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ publicKey })
        });
      } catch (err) {
        console.error('Failed to upload publicKey:', err);
      }
    }

 
    try {
      return await openpgp.readPrivateKey({ armoredKey: armored });
    } catch (err) {
      console.warn('Invalid privateKey—clearing it for regeneration', err);
      localStorage.removeItem('privateKey');
      return null;
    }
  }, [user]);


  const loadConversations = useCallback(async () => {
    if (!user) return;
    const privKey = await getPrivateKey();
    if (!privKey) {
      console.warn('No private key—skipping conversation load');
      return;
    }

    try {
      const convos = await getConversations();
      const decrypted = await Promise.all(convos.map(async c => {
        const raw = c.lastMessage.content;
        if (raw.startsWith('-----BEGIN PGP MESSAGE-----')) {
          try {
            const msg = await openpgp.readMessage({ armoredMessage: raw });
            const { data: text } = await openpgp.decrypt({
              message: msg,
              decryptionKeys: privKey
            });
            return { ...c, lastMessage: { ...c.lastMessage, content: text }, unread: c.unread };
          } catch {
            console.warn(`Failed to decrypt conversation ${c.projectId}, using raw`);
          }
        }
        return { ...c, lastMessage: { ...c.lastMessage, content: raw }, unread: c.unread };
      }));
      setConversations(decrypted);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  }, [user, getPrivateKey]);

  
  const handleNewMessage = useCallback(async (msg) => {
    if (!user) return;
    if (![msg.sender_id, msg.recipient_id].includes(user.id)) return;

    const privKey = await getPrivateKey();
    let plaintext = msg.content;

    if (privKey && plaintext.startsWith('-----BEGIN PGP MESSAGE-----')) {
      try {
        const messageObj = await openpgp.readMessage({ armoredMessage: plaintext });
        const dec = await openpgp.decrypt({
          message: messageObj,
          decryptionKeys: privKey
        });
        plaintext = dec.data;
      } catch {
        console.warn('Could not decrypt incoming message, showing raw');
      }
    }

    setConversations(prev => {
      const idx = prev.findIndex(c => c.projectId === msg.project_id);
      const update = {
        projectId: msg.project_id,
        projectTitle: msg.projectTitle,
        otherParticipant: {
          id: msg.sender_id === user.id ? msg.recipient_id : msg.sender_id,
          name: msg.sender_id === user.id ? msg.recipientName : msg.senderName
        },
        lastMessage: { content: plaintext, timestamp: msg.created_at },
        unread: msg.sender_id !== user.id
      };
      if (idx === -1) return [update, ...prev];
      const copy = [...prev];
      copy[idx] = update;
      return copy;
    });
  }, [user, getPrivateKey]);


  const setupSocket = useCallback(() => {
    if (!user || socketRef.current) return;
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      path: '/socket.io',
      transports: ['websocket','polling'],
      withCredentials: true
    });
    socketRef.current.on('connect', () => {
      socketRef.current.emit('joinUser', user.id);
    });
    socketRef.current.on('newMessage', handleNewMessage);
  }, [user, handleNewMessage]);

 
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      loadConversations();
      setupSocket();
    } else {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConversations([]);
    }
  }, [user, authLoading, loadConversations, setupSocket]);

  const startChat = useCallback(({ projectId, recipientId, recipientName, projectTitle }) => {
    setActiveConversation({ projectId, recipientId, recipientName, projectTitle });
  }, []);

  const markAsRead = useCallback(projectId => {
    setConversations(prev =>
      prev.map(c => c.projectId === projectId ? { ...c, unread: false } : c)
    );
  }, []);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      unreadCount,
      loadConversations,
      startChat,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};
