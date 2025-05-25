import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BotMessage from './BotMessage';

// Receive messages and addMessageToCurrentChat as props
function ChatArea({ messages, addMessageToCurrentChat }) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // currentBotMessageId is not strictly needed if BotMessage handles its own lifecycle based on text prop
  // However, if you want a specific "Bot is preparing response..." message before the first token, it can be useful.
  // For now, let's simplify and assume BotMessage's initial empty state is enough.

  // Scroll to bottom effect
  useEffect(() => {
    const messageDisplayArea = document.querySelector('.message-display-area');
    if (messageDisplayArea) {
      messageDisplayArea.scrollTop = messageDisplayArea.scrollHeight;
    }
  }, [messages]); // Runs every time messages (from props) change

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage = { id: `user-${Date.now()}`, sender: 'user', text: inputValue.trim() };
    addMessageToCurrentChat(userMessage); // Use prop function

    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/ask', {
        question: currentInput,
      });
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.data.answer,
      };
      addMessageToCurrentChat(botMessage);
    } catch (error) {
      console.error("Error asking question:", error);
      let userFriendlyError = 'Sorry, I encountered an error trying to get an answer. Please try again.';
      if (error.response) {
        // Server responded with a status code that falls out of the range of 2xx
        userFriendlyError = `Error from server: ${error.response.status}. Please try again.`;
        if (error.response.status === 500) {
          userFriendlyError = 'Sorry, there was a server error. Please try again later.';
        }
        // You could further customize based on error.response.data if the server sends specific error messages
      } else if (error.request) {
        // The request was made but no response was received
        userFriendlyError = 'Network error. Please check your connection and try again.';
      }
      // else: Something happened in setting up the request that triggered an Error (already covered by the default message)

      const errorBotMessage = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: userFriendlyError,
      };
      addMessageToCurrentChat(errorBotMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="message-display-area">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="message user-message">
                <p>{msg.text}</p>
              </div>
            );
          } else {
            return <BotMessage key={msg.id} text={msg.text} />;
          }
        })}
        {/* Display a generic loading indicator if isLoading is true and it's not just waiting for bot typing */}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
            <div className="loading-indicator"><p>Bot is thinking...</p></div>
        )}
      </div>
      <div className="message-input-area">
        <input
          type="text"
          placeholder="Type your question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
