import React from "react";
import ChatHistory from "../chat/ChatHistory";
import { useChat } from "../../contexts/ChatContext";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
  } = useChat();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 h-screen w-72 z-30 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ChatHistory
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={(conversation) => {
            setCurrentConversation(conversation);
            if (window.innerWidth < 768) {
              onClose();
            }
          }}
          onNewConversation={() => {
            createNewConversation();
            if (window.innerWidth < 768) {
              onClose();
            }
          }}
        />
      </aside>
    </>
  );
};

export default Sidebar;
