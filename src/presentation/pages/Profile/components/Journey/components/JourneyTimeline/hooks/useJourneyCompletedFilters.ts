import { useState, useMemo } from "react";
import type { JourneyGame } from "../../../types";

const RAWG_PLATFORM_OPTIONS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X|S",
  "Xbox One",
  "Nintendo Switch",
  "Steam Deck",
  "iOS",
  "Android",
];

const RAWG_GENRE_OPTIONS = [
  "Action",
  "Adventure",
  "RPG",
  "Shooter",
  "Indie",
  "Platformer",
  "Puzzle",
  "Racing",
  "Sports",
  "Strategy",
  "Simulation",
  "Fighting",
  "Horror",
];

export function useJourneyCompletedFilters(completedGames: JourneyGame[]) {
  const [allCompletedVisible, setAllCompletedVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const platformOptions = useMemo(
    () => RAWG_PLATFORM_OPTIONS.map((p) => ({ label: p, value: p })),
    []
  );

  const genreOptions = useMemo(
    () => RAWG_GENRE_OPTIONS.map((g) => ({ label: g, value: g })),
    []
  );

  const filteredCompleted = useMemo(
    () =>
      completedGames.filter((game) => {
        if (selectedPlatform && game.platform !== selectedPlatform) return false;
        if (selectedGenre && !(game.genres ?? []).includes(selectedGenre)) {
          return false;
        }
        return true;
      }),
    [completedGames, selectedPlatform, selectedGenre]
  );

  return {
    allCompletedVisible,
    setAllCompletedVisible,
    selectedPlatform,
    setSelectedPlatform,
    selectedGenre,
    setSelectedGenre,
    platformOptions,
    genreOptions,
    filteredCompleted,
  };
}

