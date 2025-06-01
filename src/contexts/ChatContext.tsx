import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  uploadPdf as uploadPdfApi,
  askQuestion as askQuestionApi,
} from "../services/api";
import { ChatContextType, Conversation, Message } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

// ✅ Define context once, outside the hook or component
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPdfFile, setCurrentPdfFile] = useState<string | null>(null);
  const { user } = useAuth();

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [],
      timestamp: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation;
  };

  const removePdf = () => {
    setCurrentPdfFile(null);
    setCurrentConversation(null);
    toast.success("PDF removed successfully");
  };

  const uploadPdf = async (file: File) => {
    if (!user) return;

    try {
      setIsUploading(true);

      const newConversation: Conversation = {
        id: uuidv4(),
        title: file.name.replace(".pdf", ""),
        messages: [],
        timestamp: new Date(),
      };

      setCurrentConversation(newConversation);
      setConversations((prev) => [newConversation, ...prev]);

      await uploadPdfApi(file);
      setCurrentPdfFile(file.name);

      const systemMessage: Message = {
        id: uuidv4(),
        content: `PDF "${file.name}" uploaded successfully. You can now ask questions about its content.`,
        role: "assistant",
        timestamp: new Date(),
      };

      const updatedWithMessage = {
        ...newConversation,
        messages: [systemMessage],
      };

      setCurrentConversation(updatedWithMessage);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedWithMessage.id ? updatedWithMessage : c
        )
      );
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setCurrentPdfFile(null);
      setCurrentConversation(null);
      toast.error("Failed to upload PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const askQuestion = async (question: string) => {
    if (!currentConversation || !user || !currentPdfFile) return;

    try {
      setIsProcessing(true);

      const userMessage: Message = {
        id: uuidv4(),
        content: question,
        role: "user",
        timestamp: new Date(),
      };

      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedConversation.id ? updatedConversation : c
        )
      );

      const response = await askQuestionApi(question);

      const assistantMessage: Message = {
        id: uuidv4(),
        content: response.answer || "Sorry, I could not generate an answer.",
        role: "assistant",
        timestamp: new Date(),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
      };

      setCurrentConversation(finalConversation);
      setConversations((prev) =>
        prev.map((c) => (c.id === finalConversation.id ? finalConversation : c))
      );
    } catch (error) {
      console.error("Error asking question:", error);

      const errorMessage: Message = {
        id: uuidv4(),
        content: "Failed to get a response. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };

      const errorConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, errorMessage],
      };

      setCurrentConversation(errorConversation);
      setConversations((prev) =>
        prev.map((c) => (c.id === errorConversation.id ? errorConversation : c))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        isUploading,
        isProcessing,
        currentPdfFile,
        uploadPdf,
        askQuestion,
        setCurrentConversation,
        createNewConversation,
        removePdf,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Exporting the hook separately using the same context instance
// eslint-disable-next-line react-refresh/only-export-components
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
