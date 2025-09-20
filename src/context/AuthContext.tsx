import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { listenAuth, logout } from "../services/firebase";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({ user: null, loading: true, logout });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub; // cleanup
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, logout }}>{children}</Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
