import { useState, useEffect, useCallback } from "react";
import { fetchGames, type RawgGame } from "@/shared/api/rawgApi";
import type { JourneyGame, JourneyStatus } from "@/data/types/journey";
import { isZeradoStatus } from "../../../utils";
import type { JourneyGameFormValues } from "../JourneyGameFormModal";

const DEBOUNCE_MS = 350;

const PLATFORM_OPTIONS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X|S",
  "Xbox One",
  "Nintendo Switch",
  "Steam Deck",
  "Mobile",
  "Outro",
];

const emptyForm: JourneyGameFormValues = {
  rawgGame: null,
  name: "",
  startedAt: "",
  completedAt: "",
  hoursPlayed: null,
  rating: null,
  notes: "",
  status: "PLAYING",
  platform: "",
};

function normalizeHours(v: number | null | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function useJourneyGameForm(params: {
  visible: boolean;
  initialGame?: JourneyGame | null;
  readOnly?: boolean;
  onSave: (values: JourneyGameFormValues) => void;
  onHide: () => void;
}) {
  const { visible, initialGame, readOnly = false, onSave, onHide } = params;

  const [form, setForm] = useState<JourneyGameFormValues>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<RawgGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [saveValidationError, setSaveValidationError] = useState(false);

  const completedAtRequired = isZeradoStatus(form.status);
  const hoursRequired = completedAtRequired;

  useEffect(() => {
    if (!visible) return;
    if (initialGame) {
      setForm({
        rawgGame: null,
        name: initialGame.name,
        startedAt: initialGame.startedAt ?? "",
        completedAt: initialGame.completedAt ?? "",
        hoursPlayed: normalizeHours(initialGame.hoursPlayed),
        rating: initialGame.rating ?? null,
        notes: initialGame.notes ?? "",
        status: initialGame.status,
        platform: initialGame.platform ?? "",
      });
      setSearchQuery(initialGame.name);
    } else {
      setForm({
        ...emptyForm,
        startedAt: new Date().toISOString().slice(0, 10),
      });
      setSearchQuery("");
    }
    setGames([]);
    setGamesError(null);
    setTouched(false);
    setSaveValidationError(false);
  }, [visible, initialGame]);

  useEffect(() => {
    if (!visible || readOnly || !searchQuery.trim()) {
      setGames([]);
      return;
    }
    const t = setTimeout(() => {
      setGamesLoading(true);
      setGamesError(null);
      fetchGames({ search: searchQuery.trim(), page_size: 10 })
        .then((r) => setGames(r.results ?? []))
        .catch((e) => {
          setGamesError(
            e instanceof Error ? e.message : "Erro ao buscar jogos"
          );
        })
        .finally(() => setGamesLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [visible, readOnly, searchQuery]);

  const onSelectGame = useCallback((rawg: RawgGame) => {
    setSaveValidationError(false);
    setForm((prev) => ({
      ...prev,
      rawgGame: rawg,
      name: rawg.name,
      genres: rawg.genres?.map((g) => g.name) ?? [],
    }));
    setSearchQuery(rawg.name);
    setGames([]);
  }, []);

  const handleSave = useCallback(() => {
    setTouched(true);
    setSaveValidationError(false);
    const zerado = isZeradoStatus(form.status);
    const payload: JourneyGameFormValues = {
      ...form,
      completedAt:
        zerado && !form.completedAt && form.startedAt
          ? form.startedAt
          : form.completedAt,
      hoursPlayed:
        zerado && (form.hoursPlayed == null || form.hoursPlayed < 0)
          ? 0
          : form.hoursPlayed,
    };
    if (!payload.name.trim()) {
      setSaveValidationError(true);
      return;
    }
    if (!payload.startedAt) {
      setSaveValidationError(true);
      return;
    }
    if (zerado && !payload.completedAt) {
      setSaveValidationError(true);
      return;
    }
    if (zerado && (payload.hoursPlayed == null || payload.hoursPlayed < 0)) {
      setSaveValidationError(true);
      return;
    }
    onSave(payload);
    onHide();
  }, [form, onSave, onHide]);

  const handleStatusChange = (status: JourneyStatus) => {
    setSaveValidationError(false);
    setForm((prev) => {
      const next = { ...prev, status };
      if (isZeradoStatus(status)) {
        if (!next.completedAt && next.startedAt) next.completedAt = next.startedAt;
        if (next.hoursPlayed == null) next.hoursPlayed = 0;
      }
      return next;
    });
  };

  const formIsZerado = isZeradoStatus(form.status);
  const canSave =
    form.name.trim() !== "" &&
    form.startedAt !== "" &&
    (!formIsZerado ||
      !!(
        (form.completedAt || form.startedAt) &&
        (form.hoursPlayed == null || form.hoursPlayed >= 0)
      ));

  return {
    form,
    setForm,
    searchQuery,
    setSearchQuery,
    games,
    gamesLoading,
    gamesError,
    touched,
    saveValidationError,
    completedAtRequired,
    hoursRequired,
    onSelectGame,
    handleStatusChange,
    handleSave,
    formIsZerado,
    canSave,
    PLATFORM_OPTIONS,
    readOnly,
    setSaveValidationError,
  };
}

