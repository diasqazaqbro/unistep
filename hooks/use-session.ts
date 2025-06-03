import { useEffect, useState } from "react";
import { db } from "@/lib/config"; // путь к твоему Firestore config
import { doc, getDoc } from "firebase/firestore/lite";

const SESSION_KEY = "unistep-session";

interface SessionData {
  userId: string;
  loginDate: string;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed: SessionData = JSON.parse(stored);
        setSession(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (userId: string) => {
    const sessionData: SessionData = {
      userId,
      loginDate: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return {
    session,
    isLoggedIn: !!session,
    isLoading,
    saveSession,
    clearSession,
  };
}
