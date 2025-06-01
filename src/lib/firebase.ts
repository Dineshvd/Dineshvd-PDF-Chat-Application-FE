import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwzzUCeTQ2LebJ9YTi9gsizG0ZulMF0Yo",
  authDomain: "pdf-chat-bot-5a379.firebaseapp.com",
  projectId: "pdf-chat-bot-5a379",
  storageBucket: "pdf-chat-bot-5a379.firebasestorage.app",
  messagingSenderId: "461767557705",
  appId: "1:461767557705:web:e9bd1fdd157ec55de07598",
  measurementId: "G-BF3DWPGMG2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { auth };
