import React, { useState } from "react";
import { Send } from "lucide-react";
import Button from "../ui/Button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isProcessing = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && !isProcessing && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end space-x-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 sm:p-2"
    >
      <div className="flex-grow relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about your PDF..."
          className="w-full p-2 sm:p-3 pr-8 sm:pr-10 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 dark:text-white resize-none"
          rows={1}
          disabled={isProcessing || disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          style={{
            minHeight: "40px",
            maxHeight: "120px",
          }}
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="md"
        isLoading={isProcessing}
        disabled={message.trim() === "" || isProcessing || disabled}
        rightIcon={<Send className="h-4 w-4" />}
        className="rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex items-center justify-center"
      >
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ChatInput;
