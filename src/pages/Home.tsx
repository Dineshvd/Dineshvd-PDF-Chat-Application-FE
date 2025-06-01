/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import FileUpload from "../components/ui/FileUpload";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage from "../components/chat/ChatMessage";
import { useChat } from "../contexts/ChatContext";
import { FileUp, Bot, X } from "lucide-react";
import Button from "../components/ui/Button";

const Home: React.FC = () => {
  const {
    currentConversation,
    isUploading,
    isProcessing,
    currentPdfFile,
    uploadPdf,
    askQuestion,
    removePdf,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation?.messages]);

  // 🛠️ Ensure layout re-renders when file is uploaded
  useEffect(() => {
    if (currentPdfFile) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [currentPdfFile]);

  const handleFileUpload = (file: File) => {
    uploadPdf(file);
  };

  const handleSendMessage = (message: string) => {
    askQuestion(message);
  };

  if (!currentPdfFile || !currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <FileUp className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Upload a PDF to get started
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You can ask questions about the content after uploading
            </p>
          </div>

          <FileUpload
            onFileSelect={handleFileUpload}
            isUploading={isUploading}
            accept=".pdf"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div key={currentPdfFile} className="flex flex-col h-lvh">
        {/* PDF Info Bar */}

        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPdfFile || "Unnamed PDF"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removePdf}
            className="text-gray-500 hover:text-red-500"
            leftIcon={<X className="h-4 w-4" />}
          >
            Remove PDF
          </Button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 ">
          {currentConversation.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
                <Bot className="h-10 w-10 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                PDF Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                Ask questions about your document, and I'll analyze the content
                to provide answers.
              </p>
            </div>
          ) : (
            <div>
              {currentConversation.messages.map((message: any, index: any) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLastMessage={
                    index === currentConversation.messages.length - 1
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          disabled={isUploading}
        />
      </div>
    </>
  );
};

export default Home;
