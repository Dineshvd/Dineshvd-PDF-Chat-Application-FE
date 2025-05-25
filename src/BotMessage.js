import React, { useState, useEffect } from 'react';

function BotMessage({ text }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset when text prop changes
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(intervalId);
        }
      }, 15); // Typing speed: 15ms per character

      return () => clearInterval(intervalId); // Cleanup on unmount or text change
    }
  }, [text]);

  return (
    <div className="message bot-message"> {/* Ensure this div gets the necessary classes */}
      <p>{displayedText}</p>
    </div>
  );
}

export default BotMessage;
