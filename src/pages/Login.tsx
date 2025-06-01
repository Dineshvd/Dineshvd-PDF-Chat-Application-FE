import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { FileText, Lock, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { user, loading, signIn } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-auto">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">PDF Chat</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Chat with your PDF documents using AI
            </p>
          </div>
          
          <Button
            onClick={signIn}
            className="w-full flex items-center justify-center py-2.5 sm:py-3 mt-6"
            leftIcon={
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="w-5 h-5 mr-2"
              />
            }
          >
            Sign in with Google
          </Button>
          
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
            Why use PDF Chat?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <p className="ml-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Extract insights from your documents instantly
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <p className="ml-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Secure document processing with advanced encryption
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <p className="ml-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Your data remains private and never shared with third parties
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;