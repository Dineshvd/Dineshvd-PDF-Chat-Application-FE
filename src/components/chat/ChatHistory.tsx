import React from "react";
import { MessageSquare, Clock } from "lucide-react";
import { Conversation } from "../../types";
import { cn, formatDate, truncateText } from "../../lib/utils";

interface ChatHistoryProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-3 sm:p-4 border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">PDF Chats</h2>
      </div>

      <div className="p-2">
        <button
          onClick={onNewConversation}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-1">
        {conversations.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <MessageSquare className="mx-auto h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-50" />
            <p className="text-sm sm:text-base">No conversations yet</p>
            <p className="text-xs sm:text-sm">Upload a PDF to get started</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => {
              const isActive = currentConversation?.id === conversation.id;
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];

              return (
                <li key={conversation.id}>
                  <button
                    onClick={() => onSelectConversation(conversation)}
                    className={cn(
                      "w-full text-left p-2 rounded-md transition-colors text-sm",
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium truncate max-w-[140px] sm:max-w-[180px]">
                        {conversation.title}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(conversation.timestamp)}
                      </span>
                    </div>

                    {lastMessage && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {truncateText(lastMessage.content, 40)}
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
