import { create } from "zustand";
import { persist } from "zustand/middleware";

const MOCK_USERS: Record<
  string,
  { password: string; name: string; nickname: string; platform: string }
> = {
  brunogameplay: {
    password: "123456",
    name: "Bruno Palhoti",
    nickname: "brunogameplay",
    platform: "Playstation",
  },
  darthgamer: {
    password: "123456",
    name: "Darth Gamer",
    nickname: "DarthGamer",
    platform: "Xbox",
  },
  reginhinhagameplay: {
    password: "123456",
    name: "Regina Linda",
    nickname: "reginhinhagameplay",
    platform: "Celular",
  },
  dadagameplay: {
    password: "123456",
    name: "Daphine Linda",
    nickname: "dadagameplay",
    platform: "Celular",
  },
};

export interface User {
  username: string;
  name: string;
  nickname: string;
}

export function getInitialsFromUsername(username: string): string {
  const parts = username.replace(/[^a-zA-Z0-9.]/g, "").split(/[.\s]/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase() || "?";
}

export function getInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? "";
    const b = parts[parts.length - 1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const key = username.trim().toLowerCase();
        const mock = MOCK_USERS[key];
        const isValid = mock && password === mock.password;

        if (isValid) {
          set({
            user: {
              username: key,
              name: mock.name,
              nickname: mock.nickname,
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "gamerverse-auth" }
  )
);
