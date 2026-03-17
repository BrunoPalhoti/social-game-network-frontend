import { useState, useCallback } from "react";
import type { JourneyGame } from "../types";
import type { JourneyGameFormValues } from "../components/JourneyGameFormModal";
import { isZeradoStatus } from "../utils";

interface UseJourneyFormModalParams {
  addGame: (game: Omit<JourneyGame, "monthKey"> & { startedAt: string }) => void;
  updateGame: (gameId: string, updates: Partial<JourneyGame>) => void;
  setActiveTabIndex: (index: number) => void;
}

export function useJourneyFormModal({
  addGame,
  updateGame,
  setActiveTabIndex,
}: UseJourneyFormModalParams) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<JourneyGame | null>(null);
  const [modalReadOnly, setModalReadOnly] = useState(false);

  const openModal = useCallback((game: JourneyGame | null, readOnly = false) => {
    setSelectedGame(game);
    setModalReadOnly(readOnly);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedGame(null);
  }, []);

  const handleSave = useCallback(
    (values: JourneyGameFormValues) => {
      const hoursPlayed =
        typeof values.hoursPlayed === "number" ? values.hoursPlayed : undefined;
      if (selectedGame) {
        const updates: Partial<JourneyGame> = {
          name: values.name,
          startedAt: values.startedAt || undefined,
          completedAt: values.completedAt || undefined,
          droppedAt: values.droppedAt || undefined,
          status: values.status,
          genres: values.genres ?? selectedGame.genres,
          platform: values.platform || undefined,
          droppedReason: values.droppedReason || undefined,
          releaseDate: values.releaseDate || undefined,
          hasDemo: values.hasDemo ?? false,
        };
        if (hoursPlayed !== undefined) updates.hoursPlayed = hoursPlayed;
        updateGame(selectedGame.id, updates);
      } else {
        const rawg = values.rawgGame;
        const id = rawg ? String(rawg.id) : `local-${Date.now()}`;
        const coverImageUrl = rawg?.background_image ?? "";
        addGame({
          id,
          name: values.name,
          coverImageUrl,
          startedAt: values.startedAt,
          completedAt: values.completedAt || undefined,
          droppedAt: values.droppedAt || undefined,
          hoursPlayed: hoursPlayed ?? 0,
          status: values.status,
          platform: values.platform || undefined,
          genres: values.genres ?? rawg?.genres?.map((g) => g.name),
          droppedReason: values.droppedReason || undefined,
          releaseDate: values.releaseDate || undefined,
          hasDemo: values.hasDemo ?? false,
        });
      }
      if (isZeradoStatus(values.status)) setActiveTabIndex(0);
      else if (values.status === "PLAYING") setActiveTabIndex(1);
      else if (values.status === "DROPPED") setActiveTabIndex(2);
      closeModal();
    },
    [selectedGame, addGame, updateGame, closeModal, setActiveTabIndex]
  );

  return {
    modalVisible,
    selectedGame,
    modalReadOnly,
    openModal,
    closeModal,
    handleSave,
  };
}
