import { useState } from "react";
import { getInitialsFromName, useAuthStore } from "@/shared/store/useAuthStore";
import { updateUserProfile } from "@/shared/api/mockUsersApi";
import { fetchGames, type RawgGame } from "@/shared/api/rawgApi";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface ProfileHeroProps {
  children?: React.ReactNode;
}

export function ProfileHero({ children }: ProfileHeroProps) {
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

  const isEditingAvatar = editing === "avatar";

  return (
    <section className="gv-profile-hero">
      <div className="gv-profile-banner" style={bannerStyle}>
        <button
          type="button"
          className="gv-profile-banner-edit-btn"
          onClick={() => {
            setEditing("banner");
            setSelectedCover(null);
            setBannerPositionPercent(storedBannerPositionPercent);
          }}
          aria-label="Alterar capa do perfil"
        >
          <i className="pi pi-pencil" />
        </button>
      </div>

      <div className="gv-profile-avatar-wrap">
        <div className="gv-profile-avatar-container">
          {user?.avatarUrl ? (
            <Avatar
              image={user.avatarUrl}
              size="xlarge"
              shape="circle"
              className="gv-profile-avatar"
            />
          ) : (
            <Avatar
              label={user ? getInitialsFromName(user.name) : "?"}
              size="xlarge"
              shape="circle"
              className="gv-profile-avatar"
            />
          )}
          <button
            type="button"
            className="gv-profile-avatar-edit-btn"
            onClick={() => {
              setEditing("avatar");
              setSelectedCover(null);
            }}
            aria-label="Alterar avatar"
          >
            <i className="pi pi-pencil" />
          </button>
          <Tag value="PRO" severity="secondary" className="gv-profile-badge" />
        </div>
      </div>

      <div className="gv-profile-info">
        <p className="gv-profile-name">{user?.name ?? "..."}</p>
        <h1 className="gv-profile-username">@{user?.nickname ?? "..."}</h1>
      </div>

      {children && (
        <>
          <div className="gv-profile-hero-divider" aria-hidden />
          {children}
        </>
      )}

      <Dialog
        header={isEditingAvatar ? "Escolher avatar" : "Escolher capa"}
        visible={editing !== null}
        onHide={() => {
          setEditing(null);
          setSearch("");
          setGames([]);
          setError(null);
          setSelectedCover(null);
          setBannerPositionPercent(storedBannerPositionPercent);
        }}
        className="gv-profile-edit-dialog"
        contentStyle={{ padding: "0.25rem 1rem" }}
        pt={{
          header: { style: { padding: "0.5rem 1rem 0.25rem" } },
          content: { style: { padding: "0.25rem 1rem" } },
          footer: { style: { padding: "0.25rem 1rem 0.5rem" } },
        }}
        footer={
          <div className="gv-profile-edit-dialog-footer">
            <Button
              label="Fechar"
              severity="secondary"
              onClick={() => {
                setEditing(null);
                setSearch("");
                setGames([]);
                setError(null);
                setSelectedCover(null);
                setBannerPositionPercent(storedBannerPositionPercent);
              }}
            />
            <Button
              label="Salvar"
              disabled={
                !editing ||
                (editing === "avatar" && !selectedCover) ||
                (editing === "banner" &&
                  !selectedCover &&
                  typeof user?.bannerUrl !== "string")
              }
              onClick={() => {
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
                setEditing(null);
                setSearch("");
                setGames([]);
                setError(null);
                setSelectedCover(null);
                setBannerPositionPercent(storedBannerPositionPercent);
              }}
            />
          </div>
        }
      >
        <div className="gv-profile-game-favorite-dialog">
          <label className="gv-profile-game-list-label" htmlFor="avatar-banner-search">
            Buscar jogo
          </label>
          <InputText
            id="avatar-banner-search"
            value={search}
            onChange={(e) => handleSearchGames(e.target.value)}
            placeholder="Digite o nome do jogo..."
            className="gv-profile-edit-input w-full"
            autoFocus
          />
          {editing === "banner" && (
            <div
              className="gv-profile-banner-position-controls"
              style={{ marginTop: "0.5rem" }}
            >
              <p className="gv-profile-game-list-label">
                Recorte vertical da capa
              </p>
              <input
                type="range"
                min={0}
                max={100}
                value={bannerPositionPercent}
                onChange={(e) => setBannerPositionPercent(Number(e.target.value))}
                className="gv-profile-banner-pos-slider"
              />
              <div className="gv-profile-banner-pos-hints">
                <span>Mostrar mais o topo</span>
                <span>{bannerPositionPercent}%</span>
                <span>Mostrar mais a parte de baixo</span>
              </div>
            </div>
          )}
          {loading && (
            <div className="gv-profile-dialog-games-loading">
              <i className="pi pi-spin pi-spinner" />
              Buscando jogos...
            </div>
          )}
          {error && (
            <p className="gv-profile-dialog-games-error">{error}</p>
          )}
          {!loading && !error && games.length > 0 && (
            <>
              <p className="gv-profile-game-list-label">
                Clique em um jogo para usar a capa como {isEditingAvatar ? "avatar" : "capa"}.
              </p>
              <div className="gv-profile-dialog-games-list">
                {games.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    className="gv-profile-dialog-game-item"
                    onClick={() => handleSelectGame(game)}
                  >
                    {game.background_image ? (
                      <img
                        src={game.background_image}
                        alt=""
                        className="gv-profile-game-suggestion-img"
                      />
                    ) : (
                      <div className="gv-profile-game-suggestion-img gv-profile-game-suggestion-placeholder" />
                    )}
                    <span className="gv-profile-game-suggestion-info">
                      <span className="gv-profile-game-suggestion-name">
                        {game.name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {!loading && !error && search.trim() && games.length === 0 && (
            <p className="gv-profile-dialog-games-error">
              Nenhum jogo encontrado.
            </p>
          )}
        </div>
      </Dialog>
    </section>
  );
}
