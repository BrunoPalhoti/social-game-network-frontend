import type { JourneyYearData } from "./types";

// Capas oficiais Steam CDN (App IDs) para garantir correspondência correta com o jogo
const COVER_ELDEN =
  "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg";
const COVER_HADES =
  "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/header.jpg";
const COVER_STARFIELD =
  "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg";
const COVER_INDIE =
  "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg";
const COVER_PLACEHOLDER =
  "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png";

export function getMockJourneyData(year: number): JourneyYearData {
  return {
    year,
    missionStats: {
      jogosZeradosNoAno: 2,
      totalHoursInvested: 342,
    },
    jogosZeradosNaVida: {
      totalJogos: 47,
      totalHoras: 2840,
      plataformas: ["PC", "PlayStation 5", "Xbox Series X"],
    },
    months: [
      {
        key: "2026-01",
        label: "Janeiro",
        narrative: "A jornada começou nas Terras Intermédias.",
        games: [
          {
            id: "1",
            name: "Elden Ring: Shadow of the Erdtree",
            coverImageUrl: COVER_ELDEN,
            completedAt: "2026-01-28",
            hoursPlayed: 78,
            rating: 10,
            status: "COMPLETED",
            notes: "DLC épica.",
            verdict:
              "O boss final quase me fez desistir do projeto, mas a satisfação de vencer foi maior.",
            genres: ["RPG", "Action"],
            monthKey: "2026-01",
            is100Percent: false,
          },
        ],
      },
      {
        key: "2026-02",
        label: "Fevereiro",
        narrative: "100% concluído no submundo.",
        games: [
          {
            id: "2",
            name: "Hades II",
            coverImageUrl: COVER_HADES,
            completedAt: "2026-02-15",
            hoursPlayed: 45,
            rating: 10,
            status: "PLATINUM",
            notes: "Platina.",
            verdict: "Cada corrida era uma nova história. Roguelike perfeito.",
            genres: ["Roguelike", "Action"],
            monthKey: "2026-02",
            is100Percent: true,
          },
        ],
      },
      {
        key: "2026-03",
        label: "Março",
        narrative: "O jogo que está ocupando seu tempo agora.",
        games: [
          {
            id: "3",
            name: "Starfield",
            coverImageUrl: COVER_STARFIELD,
            hoursPlayed: 62,
            rating: undefined,
            status: "PLAYING",
            notes: "Em progresso.",
            verdict: "Explorando as estrelas.",
            genres: ["RPG", "Sci-Fi"],
            monthKey: "2026-03",
          },
        ],
      },
    ],
    genreHeatMap: [
      { genre: "RPGs", percent: 80, hours: 220 },
      { genre: "Shooters", percent: 20, hours: 55 },
      { genre: "Action", percent: 65, hours: 180 },
      { genre: "Roguelike", percent: 40, hours: 90 },
      { genre: "Indie", percent: 25, hours: 45 },
    ],
    games: [
      {
        id: "1",
        name: "Elden Ring: Shadow of the Erdtree",
        coverImageUrl: COVER_ELDEN,
        completedAt: "2026-01-28",
        hoursPlayed: 78,
        rating: 10,
        status: "COMPLETED",
        verdict:
          "O boss final quase me fez desistir do projeto, mas a satisfação de vencer foi maior.",
        genres: ["RPG", "Action"],
        monthKey: "2026-01",
      },
      {
        id: "2",
        name: "Hades II",
        coverImageUrl: COVER_HADES,
        completedAt: "2026-02-15",
        hoursPlayed: 45,
        rating: 10,
        status: "PLATINUM",
        verdict: "Cada corrida era uma nova história. Roguelike perfeito.",
        genres: ["Roguelike", "Action"],
        monthKey: "2026-02",
        is100Percent: true,
      },
      {
        id: "3",
        name: "Starfield",
        coverImageUrl: COVER_STARFIELD,
        hoursPlayed: 62,
        status: "PLAYING",
        verdict: "Explorando as estrelas.",
        genres: ["RPG", "Sci-Fi"],
        monthKey: "2026-03",
      },
    ],
  };
}
