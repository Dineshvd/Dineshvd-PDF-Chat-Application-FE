export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isUploading: boolean;
  isProcessing: boolean;
  currentPdfFile: string | null;
  uploadPdf: (file: File) => Promise<void>;
  askQuestion: (question: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation) => void;
  createNewConversation: () => void;
  removePdf: () => void;
}
