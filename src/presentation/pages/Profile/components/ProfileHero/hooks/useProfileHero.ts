import { useState } from "react";
import {
  getInitialsFromName,
  useAuthStore,
} from "@/shared/store/useAuthStore";
import { updateUserProfile } from "@/shared/api/mockUsersApi";
import { fetchGames, type RawgGame } from "@/shared/api/rawgApi";

export function useProfileHero() {
  const { user, updateProfile } = useAuthStore();

  const [editing, setEditing] = useState<"avatar" | "banner" | null>(null);
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [bannerPositionPercent, setBannerPositionPercent] =
    useState<number>(50);

  const storedBannerPositionPercent =
    typeof user?.bannerPosition === "number"
      ? user.bannerPosition
      : user?.bannerPosition === "top"
        ? 0
        : user?.bannerPosition === "bottom"
          ? 100
          : 50;

  const activeBannerPositionPercent =
    editing === "banner" ? bannerPositionPercent : storedBannerPositionPercent;

  const activeBannerImage =
    (editing === "banner" && selectedCover) ||
    user?.bannerUrl ||
    user?.favoriteGameCover ||
    null;

  const bannerStyle = activeBannerImage
    ? {
        backgroundImage: `url(${activeBannerImage})`,
        backgroundPosition: `center ${activeBannerPositionPercent}%`,
        backgroundSize: "cover",
      }
    : undefined;

  function resetDialogState() {
    setEditing(null);
    setSearch("");
    setGames([]);
    setError(null);
    setSelectedCover(null);
    setBannerPositionPercent(storedBannerPositionPercent);
  }

  async function handleSearchGames(q: string) {
    const query = q.trim();
    setSearch(q);
    if (!query) {
      setGames([]);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetchGames({ search: query, page_size: 12 });
      setGames(res.results);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erro ao buscar jogos na RAWG"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSelectGame(game: RawgGame) {
    const cover = game.background_image ?? null;
    if (!editing) return;
    setSelectedCover(cover);
  }

  function handleOpenBanner() {
    setEditing("banner");
    setSelectedCover(null);
    setBannerPositionPercent(storedBannerPositionPercent);
  }

  function handleOpenAvatar() {
    setEditing("avatar");
    setSelectedCover(null);
  }

  function handleSave() {
    if (!editing) return;
    const updates: {
      avatarUrl?: string | null;
      bannerUrl?: string | null;
      bannerPosition?: number;
    } =
      editing === "avatar"
        ? { avatarUrl: selectedCover }
        : {
            bannerUrl: selectedCover ?? user?.bannerUrl ?? null,
            bannerPosition: bannerPositionPercent,
          };
    updateProfile(updates);
    if (user?.username) {
      updateUserProfile(user.username, updates as any);
    }
    resetDialogState();
  }

  const isEditingAvatar = editing === "avatar";

  const profileName = user?.name ?? "...";
  const profileNickname = user?.nickname ?? "...";
  const profileInitials = user ? getInitialsFromName(user.name) : "?";

  return {
    user,
    editing,
    search,
    games,
    loading,
    error,
    selectedCover,
    bannerPositionPercent,
    storedBannerPositionPercent,
    activeBannerPositionPercent,
    activeBannerImage,
    bannerStyle,
    isEditingAvatar,
    profileName,
    profileNickname,
    profileInitials,
    setBannerPositionPercent,
    handleSearchGames,
    handleSelectGame,
    handleOpenBanner,
    handleOpenAvatar,
    resetDialogState,
    handleSave,
  };
}

