// frontend/src/components/layout/Header.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MessageSquare } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import NotificationDropdown from "../notifications/NotificationDropdown";
import { ChatContext } from "../../contexts/chatContextObj";
import ChatModal from "../chat/ChatModal";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);


  const {
    conversations,
    activeConversation,
    unreadCount,
    startChat,
    loadConversations,
    markAsRead,
  } = useContext(ChatContext);

 
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const onSelectChat = (convo) => {
    
    startChat({
      projectId: convo.projectId,
      recipientId: convo.otherParticipant.id,
      recipientName: convo.otherParticipant.name,
      projectTitle: convo.projectTitle,
    });
    
    markAsRead(convo.projectId);
    setShowChatModal(true);
    setShowChatDropdown(false);
  };

  return (
    <>
      <header className="bg-emerald-500 text-white shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-xl font-bold">
                <img src="/agri-logo.svg" alt="AgriMarket" className="h-8 mr-2" />
                <span className="tracking-tight">AgriMarket</span>
              </Link>
            </div>

            
            <nav className="hidden md:flex items-center space-x-8">
              {!user && (
                <>
                  <a href="#features" className="hover:text-emerald-200">Features</a>
                  <a href="#how-it-works" className="hover:text-emerald-200">How It Works</a>
                  <a href="#impact" className="hover:text-emerald-200">Impact</a>
                </>
              )}
              {user && (user.role === "investor" || user.role === "admin") && (
                <Link to="/marketplace" className="hover:text-emerald-200">Marketplace</Link>
              )}
              {user && (
                <Link to="/dashboard" className="hover:text-emerald-200">Dashboard</Link>
              )}
            </nav>

          
            <div className="flex items-center space-x-4 relative">
              
              {(user?.role === "investor" || user?.role === "farmer") && (
                <div className="relative">
                  <button
                    onClick={() => setShowChatDropdown(o => !o)}
                    className="p-1 hover:text-emerald-200 focus:outline-none relative"
                  >
                    <MessageSquare size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showChatDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                      {conversations.length === 0 ? (
                        <div className="p-4 text-sm">No active chats</div>
                      ) : (
                        conversations.map(convo => (
                          <button
                            key={convo.projectId}
                            onClick={() => onSelectChat(convo)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              convo.unread ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="font-medium flex justify-between">
                              <span>{convo.projectTitle}</span>
                              {convo.unread && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {convo.lastMessage.content}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(convo.lastMessage.timestamp).toLocaleDateString()}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              
              {user && <NotificationDropdown userRole={user.role} />}

            
              {user && (
                <span className="hidden sm:inline text-sm font-medium">
                  Hi, {user.firstName}
                </span>
              )}

              
              <div className="hidden md:flex items-center space-x-3">
                {user ? (
                  <>
                    <span className="text-xs bg-emerald-800 px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 text-sm font-medium text-emerald-600 bg-white rounded-md hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className="px-3 py-1 text-sm font-medium text-emerald-600 bg-white rounded-md hover:bg-gray-100">
                      Login
                    </Link>
                    <Link to="/auth/signup" className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

           
              <button
                className="md:hidden text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(o => !o)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        
        {mobileMenuOpen && (
          <div className="md:hidden bg-emerald-700 px-4 pb-4 space-y-3">
            {!user ? (
              <>
                <a href="#features" className="block py-2 hover:text-emerald-200">Features</a>
                <a href="#how-it-works" className="block py-2 hover:text-emerald-200">How It Works</a>
                <a href="#impact" className="block py-2 hover:text-emerald-200">Impact</a>
              </>
            ) : (
              <>
                {(user.role === "investor" || user.role === "admin") && (
                  <Link to="/marketplace" className="block py-2 hover:text-emerald-200">Marketplace</Link>
                )}
                <Link to="/dashboard" className="block py-2 hover:text-emerald-200">Dashboard</Link>
                <div className="pt-2 border-t border-emerald-500 mt-2">
                  <button onClick={handleLogout} className="w-full py-2 text-left hover:bg-emerald-600">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      
      {showChatModal && activeConversation && (
        <ChatModal
          projectId={activeConversation.projectId}
          recipientId={activeConversation.recipientId}
          recipientName={activeConversation.recipientName}
          projectTitle={activeConversation.projectTitle}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </>
  );
};

export default Header;
