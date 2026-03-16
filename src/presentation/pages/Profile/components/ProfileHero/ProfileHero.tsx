import { RawgGameSuggestionList } from "../shared/RawgGameSuggestionList";
import { useProfileHero } from "./hooks/useProfileHero";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface ProfileHeroProps {
  children?: React.ReactNode;
}

export function ProfileHero({ children }: ProfileHeroProps) {
  const {
    user,
    editing,
    search,
    games,
    loading,
    error,
    bannerPositionPercent,
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
  } = useProfileHero();

  return (
    <section className="gv-profile-hero">
      <div className="gv-profile-banner" style={bannerStyle}>
        <button
          type="button"
          className="gv-profile-banner-edit-btn"
          onClick={handleOpenBanner}
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
              label={profileInitials}
              size="xlarge"
              shape="circle"
              className="gv-profile-avatar"
            />
          )}
          <button
            type="button"
            className="gv-profile-avatar-edit-btn"
            onClick={handleOpenAvatar}
            aria-label="Alterar avatar"
          >
            <i className="pi pi-pencil" />
          </button>
          <Tag value="PRO" severity="secondary" className="gv-profile-badge" />
        </div>
      </div>

      <div className="gv-profile-info">
        <p className="gv-profile-name">{profileName}</p>
        <h1 className="gv-profile-username">@{profileNickname}</h1>
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
        onHide={resetDialogState}
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
              onClick={resetDialogState}
            />
            <Button
              label="Salvar"
              onClick={handleSave}
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
          {!loading && !error && (
            <RawgGameSuggestionList
              games={games}
              emptyQuery={search}
              heading={`Clique em um jogo para usar a capa como ${isEditingAvatar ? "avatar" : "capa"}.`}
              onSelect={handleSelectGame}
            />
          )}
        </div>
      </Dialog>
    </section>
  );
}
