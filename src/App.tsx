import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
