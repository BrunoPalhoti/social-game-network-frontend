export type JourneyStatus = "COMPLETED" | "PLAYING" | "DROPPED" | "PLATINUM" | "WISHLIST";

export interface JourneyGame {
  id: string;
  name: string;
  coverImageUrl: string;
  completedAt?: string;
  hoursPlayed?: number;
  rating?: number;
  status: JourneyStatus;
  notes?: string;
  verdict?: string;
  genres?: string[];
  monthKey: string;
  is100Percent?: boolean;
  droppedReason?: string;
}

export interface JourneyMonth {
  key: string;
  label: string;
  games: JourneyGame[];
  narrative?: string;
}

export interface MissionStats {
  /** Quantidade de jogos zerados no ano (COMPLETED + PLATINUM) */
  jogosZeradosNoAno: number;
  totalHoursInvested: number;
}

/** Totais da vida toda (jogos zerados, horas, plataformas) — exibidos no Status da Missão */
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
  /** Resumo de jogos zerados na vida (horas, plataformas) — mesclado no Status da Missão */
  jogosZeradosNaVida?: JogosZeradosNaVida;
  months: JourneyMonth[];
  genreHeatMap: GenreShare[];
  games: JourneyGame[];
}
