/**
 * API da Jornada: monta JourneyYearData a partir da API RAWG.
 * Os dados de “status” e datas (zerado, jogando) são derivados para demonstração;
 * no futuro podem vir do backend do usuário.
 */

import {
  getJourneyGames,
  saveJourneyGames,
} from "@/shared/api/mockUsersApi";
import type {
  JourneyYearData,
  JourneyGame,
  JourneyMonth,
  MissionStats,
  JogosZeradosNaVida,
  GenreShare,
} from "@/data/types/journey";

const MONTH_LABELS: Record<string, string> = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};

function buildMonthsFromGames(
  games: JourneyGame[],
  _year: number
): JourneyMonth[] {
  const byMonth = new Map<string, JourneyGame[]>();
  for (const g of games) {
    const list = byMonth.get(g.monthKey) ?? [];
    list.push(g);
    byMonth.set(g.monthKey, list);
  }
  const months: JourneyMonth[] = [];
  const keys = Array.from(byMonth.keys()).sort();
  for (const key of keys) {
    const [, monthNum] = key.split("-");
    const monthGames = byMonth.get(key);
    if (!monthGames) continue;
    months.push({
      key,
      label: MONTH_LABELS[monthNum ?? ""] ?? key,
      games: monthGames,
    });
  }
  return months;
}

function buildGenreHeatMap(games: JourneyGame[]): GenreShare[] {
  const totalByGenre = new Map<string, { count: number; hours: number }>();
  let totalHours = 0;
  for (const g of games) {
    const hours = g.hoursPlayed ?? 0;
    totalHours += hours;
    for (const genre of g.genres ?? []) {
      const cur = totalByGenre.get(genre) ?? { count: 0, hours: 0 };
      cur.count += 1;
      cur.hours += hours;
      totalByGenre.set(genre, cur);
    }
  }
  if (totalHours === 0) totalHours = 1;
  return Array.from(totalByGenre.entries()).map(([genre, { hours }]) => ({
    genre,
    percent: Math.round((hours / totalHours) * 100),
    hours,
  }));
}

/**
 * Busca dados da jornada do ano do usuário (mockUsers.json). Sem dados falsos da RAWG.
 */
export function getJourneyData(
  year: number,
  username: string
): Promise<JourneyYearData> {
  const games = getJourneyGames(username, year);
  return Promise.resolve(buildYearDataFromGames(games, year));
}

/** Gera monthKey (YYYY-MM) a partir de data ISO (YYYY-MM-DD). */
function monthKeyFromDate(isoDate: string): string {
  return isoDate.slice(0, 7);
}

/**
 * Adiciona um jogo à jornada do ano e persiste em mockUsers.
 */
export function addJourneyGame(
  data: JourneyYearData,
  game: Omit<JourneyGame, "monthKey"> & { startedAt: string },
  username: string
): JourneyYearData {
  const monthKey = game.status === "PLAYING" || game.status === "DROPPED"
    ? monthKeyFromDate(game.startedAt)
    : (game.completedAt ? monthKeyFromDate(game.completedAt) : monthKeyFromDate(game.startedAt));
  const newGame: JourneyGame = { ...game, monthKey };
  const games = [...data.games, newGame];
  saveJourneyGames(username, data.year, games);
  const months = buildMonthsFromGames(games, data.year);
  const missionStats = computeMissionStats(games);
  const genreHeatMap = buildGenreHeatMap(games);
  const jogosZeradosNaVida = buildJogosZeradosNaVidaFromGames(games);
  return {
    ...data,
    games,
    months,
    missionStats,
    genreHeatMap,
    jogosZeradosNaVida,
  };
}

/**
 * Atualiza um jogo existente na jornada e persiste em mockUsers.
 */
export function updateJourneyGame(
  data: JourneyYearData,
  gameId: string,
  updates: Partial<JourneyGame>,
  username: string
): JourneyYearData {
  const games = data.games.map((g) => {
    if (g.id !== gameId) return g;
    const merged = { ...g, ...updates };
    const baseDate = merged.completedAt ?? merged.startedAt;
    if (baseDate) merged.monthKey = monthKeyFromDate(baseDate);
    return merged;
  });
  saveJourneyGames(username, data.year, games);
  const months = buildMonthsFromGames(games, data.year);
  const missionStats = computeMissionStats(games);
  const genreHeatMap = buildGenreHeatMap(games);
  const jogosZeradosNaVida = buildJogosZeradosNaVidaFromGames(games);
  return {
    ...data,
    games,
    months,
    missionStats,
    genreHeatMap,
    jogosZeradosNaVida,
  };
}

function computeMissionStats(games: JourneyGame[]): MissionStats {
  const year = new Date().getFullYear();
  const yearStr = String(year);
  const jogosZeradosNoAno = games.filter(
    (g) =>
      (g.status === "COMPLETED" || g.status === "PLATINUM") &&
      (g.completedAt?.startsWith(yearStr) ?? g.monthKey.startsWith(yearStr))
  ).length;
  const totalHoursInvested = games.reduce((acc, g) => acc + (g.hoursPlayed ?? 0), 0);
  return { jogosZeradosNoAno, totalHoursInvested };
}

function buildJogosZeradosNaVidaFromGames(games: JourneyGame[]): JogosZeradosNaVida {
  const completed = games.filter(
    (g) => g.status === "COMPLETED" || g.status === "PLATINUM"
  ).length;
  const totalHoras = games.reduce((acc, g) => acc + (g.hoursPlayed ?? 0), 0);
  return {
    totalJogos: completed,
    totalHoras,
    plataformas: ["PC", "PlayStation 5", "Xbox Series X"],
  };
}

/** Monta JourneyYearData a partir da lista de jogos (dados em @data). */
function buildYearDataFromGames(games: JourneyGame[], year: number): JourneyYearData {
  const months = buildMonthsFromGames(games, year);
  const missionStats = computeMissionStats(games);
  const genreHeatMap = buildGenreHeatMap(games);
  const jogosZeradosNaVida = buildJogosZeradosNaVidaFromGames(games);
  return {
    year,
    missionStats,
    jogosZeradosNaVida,
    months,
    genreHeatMap,
    games,
  };
}

/** Retorna dados vazios da jornada para o ano (para permitir salvar mesmo antes do carregamento). */
export function getEmptyJourneyYearData(year: number): JourneyYearData {
  return buildYearDataFromGames([], year);
}

/**
 * Limpa todos os jogos da jornada e persiste em mockUsers.
 */
export function clearAllJourneyGames(
  data: JourneyYearData,
  username: string
): JourneyYearData {
  saveJourneyGames(username, data.year, []);
  return {
    ...data,
    games: [],
    months: [],
    missionStats: { jogosZeradosNoAno: 0, totalHoursInvested: 0 },
    genreHeatMap: [],
    jogosZeradosNaVida: {
      totalJogos: 0,
      totalHoras: 0,
      plataformas: data.jogosZeradosNaVida?.plataformas ?? ["PC", "PlayStation 5", "Xbox Series X"],
    },
  };
}
