/**
 * API mock de usuários.
 * Dados vêm de @/data/mockUsers.json; novos cadastros e edições de perfil são salvos no localStorage
 * e, em dev, também gravados no arquivo mockUsers.json (via plugin Vite).
 */

import dataFromFile from "@/data/mockUsers.json";
import type { JourneyGame } from "@/data/types/journey";
import type { PlatformSelection } from "@/data/types/platformSelection";

const STORAGE_KEY = "mock_users_json";
const PROFILE_OVERRIDES_KEY = "mock_users_profile_overrides";

/** Atualizações de perfil salvas por username (jogo favorito, plataformas, gênero, jornada). */
export type ProfileOverrides = {
  favoriteGame?: string;
  favoriteGameCover?: string;
  platforms?: PlatformSelection[];
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  /** URL do avatar personalizado (ex.: personagem do jogo na RAWG). */
  avatarUrl?: string | null;
  /** URL da capa/banner do perfil (ex.: capa do game favorito na RAWG). */
  bannerUrl?: string | null;
  /** Posição vertical da capa (top/center/bottom ou percentual 0–100). */
  bannerPosition?: "top" | "center" | "bottom" | number;
  /** Jogos da jornada por ano (chave = ano em string, ex: "2026"). */
  journeyByYear?: Record<string, JourneyGame[]>;
};

/** Gera um id único no formato UUID v4 para novos usuários. */
function generateUserId(): string {
  return crypto.randomUUID();
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  nickname: string;
  platform?: string;
  /** Array de plataformas (nome + logo). Preferir em relação a "platform" (legado). */
  platforms?: PlatformSelection[];
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  /** URL do avatar personalizado (ex.: personagem do jogo na RAWG). */
  avatarUrl?: string | null;
  /** URL da capa/banner do perfil (ex.: capa do game favorito na RAWG). */
  bannerUrl?: string | null;
  /** Jogos da jornada por ano (chave = ano em string). Persistido em mockUsers.json. */
  journeyByYear?: Record<string, JourneyGame[]>;
  createdAt: string;
}

export interface CreateAccountPayload {
  username: string;
  email: string;
  password: string;
}

interface MockUsersData {
  users: UserRecord[];
}

const dataFromDataFolder: MockUsersData = {
  users: Array.isArray((dataFromFile as MockUsersData).users)
    ? ((dataFromFile as MockUsersData).users as UserRecord[])
    : [],
};

function loadFromStorage(): MockUsersData {
  const fromFile = dataFromDataFolder.users;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as unknown;
      const storedList = Array.isArray(stored) ? stored : [];
      const fileIds = new Set(fromFile.map((u) => u.id));
      const onlyNew = storedList.filter(
        (u: UserRecord) => u?.id && !fileIds.has(u.id)
      ) as UserRecord[];
      return { users: [...fromFile, ...onlyNew] };
    }
  } catch {
    // ignore
  }
  return { users: [...fromFile] };
}

/** Persiste apenas os usuários que não vêm do arquivo em data (novos cadastros). */
function saveToStorage(data: MockUsersData): void {
  const fileUsernames = new Set(
    dataFromDataFolder.users.map((u) => u.username.toLowerCase())
  );
  const onlyNew = data.users.filter(
    (u) => !fileUsernames.has(u.username.toLowerCase())
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(onlyNew));
}

function getProfileOverrides(): Record<string, ProfileOverrides> {
  try {
    const raw = localStorage.getItem(PROFILE_OVERRIDES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        return parsed as Record<string, ProfileOverrides>;
    }
  } catch {
    // ignore
  }
  return {};
}

/** Lista de usuários com overrides de perfil aplicados (para gravar no arquivo). */
function getMergedUsersForFile(): UserRecord[] {
  const data = loadFromStorage();
  const overrides = getProfileOverrides();
  return data.users.map((u) => {
    const key = u.username.trim().toLowerCase();
    const ov = overrides[key];
    if (!ov) return u;
    return {
      ...u,
      ...(ov.favoriteGame !== undefined && { favoriteGame: ov.favoriteGame }),
      ...(ov.favoriteGameCover !== undefined && { favoriteGameCover: ov.favoriteGameCover }),
      ...(ov.platforms !== undefined && { platforms: ov.platforms }),
      ...(ov.favoriteGenre !== undefined && { favoriteGenre: ov.favoriteGenre }),
      ...(ov.favoriteGenreCover !== undefined && { favoriteGenreCover: ov.favoriteGenreCover }),
      ...(ov.avatarUrl !== undefined && { avatarUrl: ov.avatarUrl }),
      ...(ov.bannerUrl !== undefined && { bannerUrl: ov.bannerUrl }),
      ...(ov.bannerPosition !== undefined && { bannerPosition: ov.bannerPosition }),
      ...(ov.journeyByYear !== undefined && { journeyByYear: ov.journeyByYear }),
    };
  });
}

/** Em dev: grava a lista atual de usuários (com overrides) em mockUsers.json. */
function persistMockUsersToFile(): void {
  if (typeof import.meta.env === "undefined" || !import.meta.env.DEV) return;
  const users = getMergedUsersForFile();
  fetch("/api/dev/mock-users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  }).catch(() => {});
}

/** Persiste alterações de perfil por username (sobrescreve dados do mock/arquivo na leitura). */
export function saveProfileOverride(
  username: string,
  updates: ProfileOverrides
): void {
  const key = username.trim().toLowerCase();
  const current = getProfileOverrides();
  const existing = current[key] ?? {};
  const merged: ProfileOverrides = { ...existing };
  for (const [k, v] of Object.entries(updates)) {
    if (v !== undefined) (merged as Record<string, unknown>)[k] = v;
    else delete merged[k as keyof ProfileOverrides];
  }
  const cleaned: ProfileOverrides = {};
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined) (cleaned as Record<string, unknown>)[k] = v;
  }
  if (Object.keys(cleaned).length > 0) {
    current[key] = cleaned;
  } else {
    delete current[key];
  }
  localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(current));
  persistMockUsersToFile();
}

/** Retorna todos os usuários (arquivo + localStorage). */
export function getUsers(): UserRecord[] {
  return loadFromStorage().users;
}

/** Retorna os jogos da jornada do usuário para o ano. Mescla override (localStorage) com arquivo (mockUsers.json); dados do arquivo têm prioridade para evitar que o modal mostre valores desatualizados. */
export function getJourneyGames(username: string, year: number): JourneyGame[] {
  const key = username.trim().toLowerCase();
  const yearStr = String(year);
  const overrides = getProfileOverrides();
  const ov = overrides[key];
  const overrideList: JourneyGame[] = Array.isArray(ov?.journeyByYear?.[yearStr])
    ? ov.journeyByYear[yearStr]
    : [];
  const data = loadFromStorage();
  const user = data.users.find((u) => u.username.trim().toLowerCase() === key);
  const fileList: JourneyGame[] = Array.isArray(user?.journeyByYear?.[yearStr])
    ? user.journeyByYear[yearStr]
    : [];
  if (fileList.length === 0) return overrideList;
  if (overrideList.length === 0) return fileList;
  const byId = new Map<string, JourneyGame>();
  for (const g of overrideList) byId.set(g.id, { ...g });
  for (const g of fileList) {
    const existing = byId.get(g.id);
    byId.set(g.id, existing ? { ...existing, ...g } : { ...g });
  }
  return Array.from(byId.values());
}

/** Salva os jogos da jornada do usuário para o ano (persiste em overrides e em mockUsers.json). */
export function saveJourneyGames(
  username: string,
  year: number,
  games: JourneyGame[]
): void {
  const key = username.trim().toLowerCase();
  if (!key) return;
  const current = getProfileOverrides();
  const existing = current[key] ?? {};
  const journeyByYear = { ...existing.journeyByYear, [String(year)]: games };
  saveProfileOverride(username, { ...existing, journeyByYear });
}

export type AuthUserSnapshot = {
  password: string;
  name: string;
  nickname: string;
  platform?: string;
  platforms?: PlatformSelection[];
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: "top" | "center" | "bottom" | number;
};

/**
 * Retorna um mapa de usuários para uso no auth (login).
 * Dados vêm do mockUsers.json + novos cadastros no localStorage + overrides de perfil.
 */
export function getUsersForAuth(): Record<string, AuthUserSnapshot> {
  const users = loadFromStorage().users;
  const overrides = getProfileOverrides();
  const map: Record<string, AuthUserSnapshot> = {};
  for (const u of users) {
    const key = u.username.trim().toLowerCase();
    const base: AuthUserSnapshot = {
      password: u.password ?? "",
      name: u.name ?? u.username,
      nickname: u.nickname ?? u.username,
      platform: u.platform,
      platforms:
        (u.platforms?.length ?? 0) > 0
          ? u.platforms
          : u.platform
            ? [{ name: u.platform, imageUrl: null }]
            : undefined,
      favoriteGame: u.favoriteGame,
      favoriteGameCover: u.favoriteGameCover,
      favoriteGenre: u.favoriteGenre,
      favoriteGenreCover: u.favoriteGenreCover,
      avatarUrl: u.avatarUrl ?? null,
      bannerUrl: u.bannerUrl ?? null,
      bannerPosition: u.bannerPosition ?? "center",
    };
    const override = overrides[key];
    map[key] = override
      ? {
          ...base,
          ...override,
          platforms: override.platforms ?? base.platforms,
        }
      : base;
  }
  return map;
}

/** Atualiza o perfil do usuário na camada de dados (localStorage); usado ao salvar nos ProfileInfoCards. */
export function updateUserProfile(
  username: string,
  updates: ProfileOverrides
): void {
  saveProfileOverride(username, updates);
}

/**
 * Simula POST de criação de conta.
 * Salva no localStorage e retorna uma Promise (como uma API real).
 */
export function createAccount(payload: CreateAccountPayload): Promise<UserRecord> {
  return new Promise((resolve, reject) => {
    const data = loadFromStorage();
    const usernameNorm = payload.username.trim().toLowerCase();
    const emailNorm = payload.email.trim().toLowerCase();
    const exists = data.users.some(
      (u) =>
        u.username.toLowerCase() === usernameNorm ||
        u.email.toLowerCase() === emailNorm
    );
    if (exists) {
      reject(new Error("Username ou e-mail já cadastrado."));
      return;
    }
    const name = payload.username.trim();
    const user: UserRecord = {
      id: generateUserId(),
      username: usernameNorm,
      email: payload.email.trim(),
      password: payload.password,
      name,
      nickname: usernameNorm,
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
    saveToStorage(data);
    persistMockUsersToFile();
    setTimeout(() => resolve(user), 300);
  });
}

/** Baixa os usuários salvos como arquivo .json (para inspeção ou uso como mock) */
export function exportUsersAsJson(filename = "mockUsers.json"): void {
  const data = loadFromStorage();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
