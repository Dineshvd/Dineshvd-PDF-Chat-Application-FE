import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage = false,
}) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex gap-2 sm:gap-3 p-3 sm:p-4',
        isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900',
        isLastMessage && 'animate-fadeIn'
      )}
    >
      <div className={cn(
        'flex-shrink-0 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full',
        isUser ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
      )}>
        {isUser ? (
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </div>
      
      <div className="flex-1 space-y-1 sm:space-y-2">
        <div className="flex items-center">
          <h3 className="font-semibold text-xs sm:text-sm">
            {isUser ? 'You' : 'PDF Assistant'}
          </h3>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {formatDate(message.timestamp)}
          </span>
        </div>
        
        <div className="prose dark:prose-invert prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;