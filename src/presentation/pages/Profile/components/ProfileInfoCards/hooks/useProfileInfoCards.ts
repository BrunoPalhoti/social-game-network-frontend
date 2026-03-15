import { useCallback, useEffect, useState } from "react";
import {
  getMockUserProfile,
  useAuthStore,
  type User,
} from "@/shared/store/useAuthStore";
import { updateUserProfile } from "@/shared/api/mockUsersApi";
import type { FavoriteGameSelection } from "@/data/types/favoriteGame";
import type { PlatformSelection } from "@/data/types/platformSelection";
import {
  fetchGames,
  fetchPlatforms,
  type RawgGame,
  type RawgPlatform,
} from "@/shared/api/rawgApi";

/** Campos editáveis do perfil (cards de info). */
export type EditableField = keyof Pick<
  User,
  "favoriteGame" | "platforms" | "favoriteGenre"
>;

/** Delay (ms) antes de disparar a busca na RAWG ao digitar. */
const DEBOUNCE_MS = 350;

/**
 * Hook que concentra a lógica dos cards de perfil (Game Favorito, Plataformas, Gênero).
 * - Valores exibidos vêm do user (store) ou do mock (getMockUserProfile).
 * - Edição do "Game Favorito" usa busca na API RAWG com debounce e lista de sugestões.
 * - Edição de "Plataformas" usa lista RAWG, multi-select (array) com nome + logo.
 */
export function useProfileInfoCards() {
  const { user, updateProfile } = useAuthStore();
  const mockProfile = getMockUserProfile(user?.username);

  // —— Estado do modal de edição ———————————————————————————————————————————
  const [editingCard, setEditingCard] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState("");

  // —— Estado da busca RAWG (Game Favorito) ———————————————————————————————————
  const [games, setGames] = useState<RawgGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<FavoriteGameSelection | null>(null);

  // —— Estado da lista de plataformas (Plataformas) ——————————————————————————
  const [platformsList, setPlatformsList] = useState<RawgPlatform[]>([]);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [platformsError, setPlatformsError] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformSelection[]>([]);

  const isFavoriteGameEdit = editingCard === "favoriteGame";
  const isPlatformsEdit = editingCard === "platforms";

  /** Valor a exibir no card: user > mock > "Em breve". Para "platforms" retorna "Em breve" se vazio. */
  const getDisplayValue = useCallback(
    (field: EditableField): string => {
      if (field === "platforms") {
        const arr = user?.platforms ?? mockProfile.platforms ?? [];
        return arr.length > 0 ? "" : "Em breve";
      }
      const value = user?.[field] ?? mockProfile[field];
      return value ?? "Em breve";
    },
    [user, mockProfile]
  );

  /** Array de plataformas (nome + logo) para exibir no card. Máximo 3 prediletas. */
  const getDisplayPlatforms = useCallback((): PlatformSelection[] => {
    const list = user?.platforms ?? mockProfile.platforms ?? [];
    return list.slice(0, 3);
  }, [user?.platforms, mockProfile.platforms]);

  /** URL da capa do jogo favorito (user ou mock). */
  const getDisplayCover = useCallback((): string | null | undefined => {
    return user?.favoriteGameCover ?? mockProfile.favoriteGameCover ?? undefined;
  }, [user?.favoriteGameCover, mockProfile.favoriteGameCover]);

  /** Abre o modal para editar o campo. */
  const openEdit = useCallback(
    (field: EditableField) => {
      setEditingCard(field);
      const value = getDisplayValue(field);
      const initial = value === "Em breve" ? "" : value;
      setEditValue(initial);

      if (field === "favoriteGame") {
        const cover = getDisplayCover();
        setSelectedGame(
          initial ? { name: initial, cover: cover ?? null } : null
        );
        setGames([]);
        setGamesError(null);
        if (initial.trim()) {
          setGamesLoading(true);
          fetchGames({ search: initial.trim(), page_size: 10 })
            .then((r) => setGames(r.results))
            .catch((e) => {
              setGamesError(
                e instanceof Error ? e.message : "Erro ao buscar jogos"
              );
            })
            .finally(() => setGamesLoading(false));
        }
      }

      if (field === "platforms") {
        setSelectedPlatforms(getDisplayPlatforms());
        setPlatformsList([]);
        setPlatformsError(null);
        setPlatformsLoading(true);
        fetchPlatforms({ page_size: 50 })
          .then((r) => setPlatformsList(r.results))
          .catch((e) => {
            setPlatformsError(
              e instanceof Error ? e.message : "Erro ao carregar plataformas"
            );
          })
          .finally(() => setPlatformsLoading(false));
      }
    },
    [getDisplayValue, getDisplayCover, getDisplayPlatforms]
  );

  /** Fecha o modal e limpa todo o estado de edição/busca. */
  const closeEdit = useCallback(() => {
    setEditingCard(null);
    setEditValue("");
    setGames([]);
    setGamesLoading(false);
    setGamesError(null);
    setSelectedGame(null);
    setPlatformsList([]);
    setPlatformsLoading(false);
    setPlatformsError(null);
    setSelectedPlatforms([]);
  }, []);

  /** Persiste no perfil (store + camada de dados/localStorage para sobreviver a logout). */
  const saveEdit = useCallback(() => {
    if (!editingCard || !user?.username) return;
    if (editingCard === "favoriteGame") {
      const name = (selectedGame?.name ?? editValue).trim() || undefined;
      const cover = selectedGame?.cover ?? undefined;
      const updates = { favoriteGame: name, favoriteGameCover: cover };
      updateProfile(updates);
      updateUserProfile(user.username, updates);
    } else if (editingCard === "platforms") {
      const list = selectedPlatforms.slice(0, 3);
      const updates = { platforms: list.length > 0 ? list : undefined };
      updateProfile(updates);
      updateUserProfile(user.username, updates);
    } else {
      const value = editValue.trim() || undefined;
      const updates = { [editingCard]: value } as { favoriteGenre?: string };
      updateProfile(updates);
      updateUserProfile(user.username, updates);
    }
    closeEdit();
  }, [editingCard, editValue, selectedGame, selectedPlatforms, user?.username, updateProfile, closeEdit]);

  // —— Busca de jogos na RAWG com debounce ——————————————————————————————————
  useEffect(() => {
    if (!isFavoriteGameEdit) return;
    const q = editValue.trim();
    if (!q) {
      setGames([]);
      setGamesError(null);
      return;
    }
    const t = setTimeout(() => {
      setGamesLoading(true);
      setGamesError(null);
      fetchGames({ search: q, page_size: 12 })
        .then((r) => setGames(r.results))
        .catch((e) => {
          setGamesError(
            e instanceof Error ? e.message : "Erro ao buscar jogos"
          );
        })
        .finally(() => setGamesLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [isFavoriteGameEdit, editValue]);

  /** Filtra a lista de plataformas pelo texto digitado (client-side). */
  const filteredPlatforms = editValue.trim()
    ? platformsList.filter((p) =>
        p.name.toLowerCase().includes(editValue.trim().toLowerCase())
      )
    : platformsList;

  /** Marca um jogo da lista como selecionado (nome + capa). */
  const onSelectGame = useCallback((game: RawgGame) => {
    setSelectedGame({
      name: game.name,
      cover: game.background_image ?? null,
    });
    setEditValue(game.name);
  }, []);

  /** Máximo de plataformas prediletas. */
  const MAX_PLATFORMS = 3;

  /** Adiciona uma plataforma à seleção (máx. 3, evita duplicar). */
  const onAddPlatform = useCallback((platform: RawgPlatform) => {
    setSelectedPlatforms((prev) => {
      if (prev.length >= MAX_PLATFORMS) return prev;
      if (prev.some((p) => p.name === platform.name)) return prev;
      return [
        ...prev,
        { name: platform.name, imageUrl: platform.image ?? null },
      ];
    });
  }, []);

  /** Remove uma plataforma da seleção pelo índice. */
  const onRemovePlatform = useCallback((index: number) => {
    setSelectedPlatforms((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    getDisplayValue,
    getDisplayCover,
    getDisplayPlatforms,
    openEdit,
    closeEdit,
    saveEdit,
    onSelectGame,
    onAddPlatform,
    onRemovePlatform,
    editingCard,
    editValue,
    setEditValue,
    isFavoriteGameEdit,
    isPlatformsEdit,
    games,
    gamesLoading,
    gamesError,
    platformsList: filteredPlatforms,
    platformsLoading,
    platformsError,
    selectedPlatforms,
    maxPlatforms: MAX_PLATFORMS,
  };
}
