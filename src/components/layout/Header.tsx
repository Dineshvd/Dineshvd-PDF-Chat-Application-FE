import React from "react";
import { Menu, LogOut } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gray-900 text-white border-b border-gray-700 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 mr-2 rounded-md hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center">
          <span className="text-xl font-bold">PDF Chat</span>
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Beta
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center">
            {user?.photoURL ? (
              <img
                src={user?.photoURL}
                alt={user?.name}
                className="h-8 w-8 rounded-full mr-2"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium">{user?.name}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-gray-300 hover:text-white"
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
