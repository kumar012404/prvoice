"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveProfile, initAnalytics, getProfile } from "@/lib/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  error: string;
  setError: (e: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  resetPassword: async () => {},
  logOut: async () => {},
  error: "",
  setError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn(email: string, password: string) {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign in failed";
      setError(formatFirebaseError(msg));
      throw e;
    }
  }

  async function signUp(email: string, password: string, name: string) {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const username = name.toLowerCase().replace(/\s+/g, "");
      await saveProfile(uid, {
        uid,
        name,
        email,
        username,
        bio: "Hey there! I'm using BioLink Pro 🚀",
        title: "My Bio",
        profilePicture: "",
        backgroundImage: "",
        backgroundColor: "#0B0F19",
        backgroundGradient: "gradient1",
        theme: "dark",
      });
      await initAnalytics(uid);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign up failed";
      setError(formatFirebaseError(msg));
      throw e;
    }
  }

  async function signInWithGoogle() {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;
      const profile = await getProfile(uid);
      if (!profile) {
        const name = cred.user.displayName || "User";
        const username = name.toLowerCase().replace(/\s+/g, "") + Math.floor(100 + Math.random() * 900);
        await saveProfile(uid, {
          uid,
          name,
          email: cred.user.email || "",
          username,
          bio: "Hey there! I'm using BioLink Pro 🚀",
          title: "My Bio",
          profilePicture: cred.user.photoURL || "",
          backgroundImage: "",
          backgroundColor: "#0B0F19",
          backgroundGradient: "gradient1",
          theme: "dark",
        });
        await initAnalytics(uid);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google Sign-in failed";
      setError(formatFirebaseError(msg));
      throw e;
    }
  }

  async function resetPassword(email: string) {
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Reset failed";
      setError(formatFirebaseError(msg));
      throw e;
    }
  }

  async function logOut() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, resetPassword, logOut, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function formatFirebaseError(msg: string): string {
  if (msg.includes("email-already-in-use")) return "This email is already registered.";
  if (msg.includes("wrong-password") || msg.includes("invalid-credential"))
    return "Invalid email or password.";
  if (msg.includes("user-not-found")) return "No account found with this email.";
  if (msg.includes("weak-password")) return "Password should be at least 6 characters.";
  if (msg.includes("invalid-email")) return "Invalid email address.";
  if (msg.includes("network-request-failed")) return "Network error. Check your connection.";
  if (msg.includes("too-many-requests")) return "Too many attempts. Try again later.";
  return "An error occurred. Please try again.";
}
