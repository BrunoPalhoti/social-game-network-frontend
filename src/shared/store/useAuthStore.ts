import { create } from "zustand";

/** Credenciais mock para desenvolvimento */
const MOCK_USERNAME = "bruno.palhoti";
const MOCK_PASSWORD = "123456";

export interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (username: string, password: string) => {
    const isValid =
      username.trim().toLowerCase() === MOCK_USERNAME &&
      password === MOCK_PASSWORD;

    if (isValid) {
      set({
        user: { username: username.trim() },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));
