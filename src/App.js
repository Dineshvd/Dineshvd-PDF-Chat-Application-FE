import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
import './App.css';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import LoginScreen from './LoginScreen';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Load History on Mount (only if logged in)
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
          setChatHistory(JSON.parse(savedHistory));
        }
      } catch (error) { console.error("Error parsing chat history:", error); setChatHistory([]);}
    }
  }, [isLoggedIn]); // Add isLoggedIn as a dependency

  // Save History on Change (only if logged in)
  useEffect(() => {
    if (isLoggedIn && (chatHistory.length > 0 || localStorage.getItem('chatHistory') !== null)) {
      try {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      } catch (error) { console.error("Error saving chat history:", error); }
    }
  }, [chatHistory, isLoggedIn]); // Add isLoggedIn as a dependency


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentChat([]);
    setActiveChatId(null);
    navigate('/'); // Navigate to main chat page after login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentChat([]);
    setActiveChatId(null);
    // Optionally clear chat history from localStorage on logout
    // localStorage.removeItem('chatHistory'); 
    // setChatHistory([])
    navigate('/login'); // Navigate to login page after logout
  };

  const startNewChat = () => {
    setCurrentChat([]);
    setActiveChatId(null);
    // Potentially clear PDF processed message in Sidebar (can be a prop function if needed)
  };

  const selectChat = (chatId) => {
    const foundChat = chatHistory.find(chat => chat.id === chatId);
    if (foundChat) {
      setCurrentChat(foundChat.messages);
      setActiveChatId(chatId);
    }
  };

  const addMessageToCurrentChat = (message) => {
    setCurrentChat(prev => [...prev, message]);

    if (activeChatId === null) {
      // New chat
      const newChatId = `chat-${Date.now()}`;
      setActiveChatId(newChatId);
      const newChatSession = {
        id: newChatId,
        title: message.text.substring(0, 30) + (message.text.length > 30 ? '...' : ''),
        messages: [message]
      };
      setChatHistory(prev => [newChatSession, ...prev]); // Add new chat to the beginning
    } else {
      // Existing chat
      setChatHistory(prevHistory =>
        prevHistory.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        )
      );
    }
  };

  const handlePdfProcessed = () => {
    startNewChat(); // A new PDF starts a new conversation
  };


  // Define a component for the main chat layout
  const MainChatLayout = () => (
    <div className="app-container">
      <button 
        onClick={handleLogout} 
        style={{ 
          position: 'fixed', 
          top: '15px', 
          right: '20px', 
          zIndex: 1001, /* Ensure it's above other elements */
          padding: '8px 15px',
          backgroundColor: '#dc3545', /* A distinct logout color */
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '0.9em'
        }}
      >
        Logout
      </button>
      <div className="sidebar">
        <Sidebar
          chatHistory={chatHistory}
          startNewChat={startNewChat}
          selectChat={selectChat}
          activeChatId={activeChatId}
          handlePdfProcessed={handlePdfProcessed}
        />
      </div>
      <div className="chat-area">
        <ChatArea
          messages={currentChat}
          addMessageToCurrentChat={addMessageToCurrentChat}
        />
      </div>
    </div>
  );
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isLoggedIn ? <Navigate to="/" /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
        } 
      />
      <Route 
        path="/" 
        element={
          isLoggedIn ? <MainChatLayout /> : <Navigate to="/login" />
        } 
      />
      {/* Add other routes here if needed, e.g., a catch-all for 404 */}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
