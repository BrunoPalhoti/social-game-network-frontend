/**
 * Tipos da Jornada de jogos (dados vindos de @/data + API RAWG).
 */

export type JourneyStatus =
  | "COMPLETED"
  | "PLAYING"
  | "DROPPED"
  | "PLATINUM"
  | "WISHLIST";

export interface JourneyGame {
  id: string;
  name: string;
  coverImageUrl: string;
  /** Data em que começou a jogar (ISO YYYY-MM-DD). */
  startedAt?: string;
  /** Data em que zerou o jogo (ISO YYYY-MM-DD). Opcional quando status = PLAYING. */
  completedAt?: string;
  /** Data em que dropou o jogo (ISO YYYY-MM-DD). Opcional quando status ≠ DROPPED. */
  droppedAt?: string;
  hoursPlayed?: number;
  rating?: number;
  status: JourneyStatus;
  notes?: string;
  verdict?: string;
  /** Gêneros do jogo (preenchido ao selecionar da RAWG). */
  genres?: string[];
  /** Plataforma em que jogou (ex.: PlayStation 5, PC). */
  platform?: string;
  monthKey: string;
  is100Percent?: boolean;
  droppedReason?: string;
  /** Para jogos desejados: data de lançamento (ISO YYYY-MM-DD). */
  releaseDate?: string;
  /** Para jogos desejados: indica se já há demo jogável. */
  hasDemo?: boolean;
}

export interface JourneyMonth {
  key: string;
  label: string;
  games: JourneyGame[];
  narrative?: string;
}

export interface MissionStats {
  jogosZeradosNoAno: number;
  totalHoursInvested: number;
}

export interface JogosZeradosNaVida {
  totalJogos: number;
  totalHoras: number;
  plataformas: string[];
}

export interface GenreShare {
  genre: string;
  percent: number;
  hours?: number;
}

export interface JourneyYearData {
  year: number;
  missionStats: MissionStats;
  jogosZeradosNaVida?: JogosZeradosNaVida;
  months: JourneyMonth[];
  genreHeatMap: GenreShare[];
  games: JourneyGame[];
}
