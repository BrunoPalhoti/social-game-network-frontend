/**
 * Cliente para a API RAWG (https://rawg.io/apidocs).
 * Lista e busca jogos. Use a variável de ambiente VITE_RAWG_API_KEY com sua chave.
 */

const BASE_URL = "https://api.rawg.io/api";

function getApiKey(): string {
  const key = import.meta.env.VITE_RAWG_API_KEY;
  if (!key || typeof key !== "string") {
    console.warn(
      "VITE_RAWG_API_KEY não definida. Crie um arquivo .env com VITE_RAWG_API_KEY=sua_chave"
    );
    return "";
  }
  return key;
}

export interface RawgGame {
  id: number;
  name: string;
  slug: string;
  released?: string;
  background_image: string | null;
  rating: number;
  rating_top: number;
  metacritic?: number;
  playtime?: number;
  platforms?: Array<{ platform: { name: string } }>;
  genres?: Array<{ name: string }>;
}

export interface RawgGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}

export interface FetchGamesParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

/**
 * Busca lista de jogos na API RAWG.
 * Sem search, retorna jogos populares/ordenados.
 */
export async function fetchGames(
  params: FetchGamesParams = {}
): Promise<RawgGamesResponse> {
  const key = getApiKey();
  const searchParams = new URLSearchParams();
  if (key) searchParams.set("key", key);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.page_size ?? 12));
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.ordering) searchParams.set("ordering", params.ordering);

  const url = `${BASE_URL}/games?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<RawgGamesResponse>;
}

// —— Plataformas —————————————————————————————————————————————————────────———

export interface RawgPlatform {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  image_background?: string | null;
  games_count?: number;
}

export interface RawgPlatformsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgPlatform[];
}

export interface FetchPlatformsParams {
  page?: number;
  page_size?: number;
  ordering?: string;
}

/**
 * Lista plataformas na API RAWG (ex.: PlayStation, Xbox, PC).
 * Retorna nome e logo (image). Sem parâmetro de busca; filtrar no cliente se necessário.
 */
export async function fetchPlatforms(
  params: FetchPlatformsParams = {}
): Promise<RawgPlatformsResponse> {
  const key = getApiKey();
  const searchParams = new URLSearchParams();
  if (key) searchParams.set("key", key);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.page_size ?? 20));
  if (params.ordering) searchParams.set("ordering", params.ordering);

  const url = `${BASE_URL}/platforms?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<RawgPlatformsResponse>;
}
