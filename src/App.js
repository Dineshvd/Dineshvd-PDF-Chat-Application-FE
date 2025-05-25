import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Load History on Mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
        // Optionally, load the last active chat or the most recent one
      }
    } catch (error) {
      console.error("Error parsing chat history from localStorage:", error);
      setChatHistory([]); // Start fresh if parsing fails
    }
  }, []);

  // Save History on Change
  useEffect(() => {
    try {
      // Only save if chatHistory has been initialized and has items,
      // or if localStorage already has an item (to allow clearing history by setting it to empty array).
      if (chatHistory.length > 0 || localStorage.getItem('chatHistory') !== null) {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      }
    } catch (error) {
      console.error("Error saving chat history to localStorage:", error);
      // Optionally, inform the user if this is critical
    }
  }, [chatHistory]);

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

  return (
    <div className="app-container">
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
}

export default App;
