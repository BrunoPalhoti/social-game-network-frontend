import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUsersForAuth } from "@/shared/api/mockUsersApi";
import type { PlatformSelection } from "@/data/types/platformSelection";

export function getMockUserProfile(
  username: string | undefined
): {
  platforms?: PlatformSelection[];
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: "top" | "center" | "bottom" | number;
} {
  if (!username) return {};
  const key = username.trim().toLowerCase();
  const users = getUsersForAuth();
  const mock = users[key];
  if (!mock) return {};
  const platforms =
    (mock.platforms?.length ?? 0) > 0
      ? mock.platforms
      : mock.platform
        ? [{ name: mock.platform, imageUrl: null as string | null }]
        : undefined;
  return {
    platforms,
    favoriteGame: mock.favoriteGame,
    favoriteGameCover: mock.favoriteGameCover,
    favoriteGenre: mock.favoriteGenre,
    favoriteGenreCover: mock.favoriteGenreCover,
    avatarUrl: mock.avatarUrl ?? null,
    bannerUrl: mock.bannerUrl ?? null,
    bannerPosition: mock.bannerPosition ?? "center",
  };
}

export interface User {
  username: string;
  name: string;
  nickname: string;
  /** Plataformas que joga (array com nome + logo). Substitui o antigo "platform" (string). */
  platforms?: PlatformSelection[];
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
   /** URL do avatar personalizado (ex.: personagem do jogo na RAWG). */
  avatarUrl?: string | null;
  /** URL da capa/banner do perfil (ex.: capa do game favorito na RAWG). */
  bannerUrl?: string | null;
  /** Posição vertical da capa (para centralizar melhor o foco). Aceita presets antigos ("top" | "center" | "bottom") ou valor contínuo (0–100). */
  bannerPosition?: "top" | "center" | "bottom" | number;
}

export function getInitialsFromUsername(username: string): string {
  const parts = username
    .replace(/[^a-zA-Z0-9.]/g, "")
    .split(/[.\s]/)
    .filter(Boolean);
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
  loginCreatedUser: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "platforms" | "favoriteGame" | "favoriteGameCover" | "favoriteGenre" | "favoriteGenreCover" | "avatarUrl" | "bannerUrl">>) => void;
  updateProfile: (updates: Partial<Pick<User, "platforms" | "favoriteGame" | "favoriteGameCover" | "favoriteGenre" | "favoriteGenreCover" | "avatarUrl" | "bannerUrl" | "bannerPosition">>) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const key = username.trim().toLowerCase();
        const users = getUsersForAuth();
        const mock = users[key];
        const isValid = mock && password === mock.password;

        if (isValid && mock) {
          set({
            user: {
              username: key,
              name: mock.name,
              nickname: mock.nickname,
              platforms:
                mock.platforms?.length
                  ? mock.platforms
                  : mock.platform
                    ? [{ name: mock.platform, imageUrl: null }]
                    : undefined,
              favoriteGame: mock.favoriteGame,
              favoriteGameCover: mock.favoriteGameCover,
              favoriteGenre: mock.favoriteGenre,
              favoriteGenreCover: mock.favoriteGenreCover,
              avatarUrl: mock.avatarUrl ?? null,
              bannerUrl: mock.bannerUrl ?? null,
              bannerPosition: mock.bannerPosition ?? "center",
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      loginCreatedUser: (user: User) =>
        set({ user, isAuthenticated: true }),

      updateProfile: (updates) =>
        set((state) =>
          state.user
            ? { user: { ...state.user, ...updates } }
            : state
        ),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "gamerverse-auth" }
  )
);
