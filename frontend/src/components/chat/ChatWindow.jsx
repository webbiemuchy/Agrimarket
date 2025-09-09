// frontend/src/components/chat/ChatWindow.jsx
import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import Button from "../ui/Button";

const ChatWindow = ({ chat, onClose }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    

    setMessage("");
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center">
        <button onClick={onClose} className="md:hidden mr-3">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="font-bold">Chat about: Proposal Title</h3>
          <p className="text-sm text-gray-600">
            With:{" "}
            {chat.farmerId === "currentUserId"
              ? "Investor Name"
              : "Farmer Name"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "currentUserId" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${
                msg.sender === "currentUserId"
                  ? "bg-emerald-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
              <div className="text-xs opacity-80 mt-1">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <Button type="submit" className="rounded-l-none">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
