/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, signInWithGoogle, logoutUser } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { AuthContextType, User } from "../types";
import { toast } from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          photoURL: firebaseUser?.photoURL || undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/popup-blocked"
      ) {
        toast.error(
          "Please enable pop-ups for this site to sign in with Google",
          {
            duration: 5000,
            position: "top-center",
          }
        );
      } else {
        toast.error("Failed to sign in. Please try again later.", {
          duration: 3000,
          position: "top-center",
        });
      }
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
