// frontend/src/components/chat/ChatModal.jsx
// frontend/src/components/chat/ChatModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import * as openpgp from "openpgp";
import { X, MessageCircle } from "lucide-react";
import { getChat, sendMessage } from "../../services/chatService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const ChatModal = ({
  projectId,
  recipientId,
  recipientName,
  projectTitle,
  onClose,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const socketRef = useRef(null);

  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  
  useEffect(() => {
    const handleMouseMove = e => {
      if (!dragging) return;
      setPos({
        x: e.clientX - rel.x,
        y: e.clientY - rel.y
      });
    };
    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);

  const onMouseDown = e => {
    if (e.target.closest(".chat-modal-header")) {
      const rect = modalRef.current.getBoundingClientRect();
      setRel({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDragging(true);
      e.preventDefault();
    }
  };

 
  const decryptMessage = async armored => {
    try {
      if (!armored.startsWith("-----BEGIN PGP MESSAGE-----"))
        return armored;
      const privArmored = localStorage.getItem("privateKey");
      const privateKey = await openpgp.readPrivateKey({ armoredKey: privArmored });
      const msg = await openpgp.readMessage({ armoredMessage: armored });
      const { data: decrypted } = await openpgp.decrypt({
        message: msg,
        decryptionKeys: privateKey
      });
      return decrypted;
    } catch {
      return armored;
    }
  };

  
  useEffect(() => {
    (async () => {
      try {
        const history = await getChat(projectId);
        const plain = await Promise.all(
          history.map(async m => ({
            ...m,
            content: await decryptMessage(m.content)
          }))
        );
        setMessages(plain);
      } catch (err) {
        console.error("Failed to load chat:", err);
      } finally {
        setLoading(false);
      }
    })();

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true
    });
    socketRef.current.emit("joinProject", projectId);
    socketRef.current.emit("joinUser", user.id);

    socketRef.current.on("newMessage", async msg => {
      if (msg.project_id !== projectId) return;
      const content = await decryptMessage(msg.content);
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, { ...msg, content }];
      });
    });

    return () => socketRef.current?.disconnect();
  }, [projectId, user.id]);

 
  const handleSend = async e => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      content: newMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");
    try {
      await sendMessage(projectId, { recipientId, content: newMessage });
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4"
      onMouseDown={onMouseDown}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-lg"
        style={{ position: "absolute", top: pos.y, left: pos.x }}
      >
       
        <div className="chat-modal-header flex items-center justify-between p-4 border-b cursor-move">
          <div className="flex items-center">
            <MessageCircle size={20} className="mr-2 text-emerald-600" />
            <div>
              <h3 className="font-bold text-lg">Chat about: {projectTitle}</h3>
              <p className="text-sm text-gray-600">With: {recipientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet. Say hello!</div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === user.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg ${
                    msg.sender_id === user.id
                      ? "bg-emerald-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="px-4 py-2">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;

