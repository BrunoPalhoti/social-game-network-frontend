import { useState, useEffect, useCallback } from "react";
import {
  getJourneyData,
  getEmptyJourneyYearData,
  addJourneyGame,
  updateJourneyGame,
  clearAllJourneyGames,
} from "@/data/journeyApi";
import type {
  JourneyYearData,
  JourneyGame,
} from "@/data/types/journey";

export function useJourneyData(
  year: number,
  username: string
): {
  data: JourneyYearData | null;
  loading: boolean;
  error: Error | null;
  addGame: (game: Omit<JourneyGame, "monthKey"> & { startedAt: string }) => void;
  updateGame: (gameId: string, updates: Partial<JourneyGame>) => void;
  clearAll: () => void;
} {
  const [data, setData] = useState<JourneyYearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getJourneyData(year, username)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [year, username]);

  const addGame = useCallback(
    (game: Omit<JourneyGame, "monthKey"> & { startedAt: string }) => {
      if (!username) return;
      setData((prev) => {
        const state = prev ?? getEmptyJourneyYearData(year);
        return addJourneyGame(state, game, username);
      });
    },
    [year, username]
  );

  const updateGame = useCallback(
    (gameId: string, updates: Partial<JourneyGame>) => {
      if (!username) return;
      setData((prev) => {
        if (!prev) return null;
        return updateJourneyGame(prev, gameId, updates, username);
      });
    },
    [username]
  );

  const clearAll = useCallback(() => {
    if (!username) return;
    setData((prev) => {
      if (!prev) return null;
      return clearAllJourneyGames(prev, username);
    });
  }, [username]);

  return { data, loading, error, addGame, updateGame, clearAll };
}
