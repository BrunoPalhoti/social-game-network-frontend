import { InfoCard } from "@/presentation/components/InfoCard";
import { type User } from "@/shared/store/useAuthStore";
import { useProfileInfoCards } from "./hooks";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

type EditableField = keyof Pick<
  User,
  "favoriteGame" | "platforms" | "favoriteGenre"
>;

const CARD_CONFIG: Array<{
  field: EditableField;
  label: string;
  icon: string;
}> = [
  { field: "favoriteGame", label: "GAME FAVORITO:", icon: "pi pi-heart" },
  { field: "platforms", label: "PLATAFORMAS:", icon: "pi pi-desktop" },
  { field: "favoriteGenre", label: "GÊNERO FAVORITO:", icon: "pi pi-star" },
];

export function ProfileInfoCards() {
  const {
    getDisplayValue,
    getDisplayCover,
    getDisplayGenreCover,
    getDisplayPlatforms,
    openEdit,
    closeEdit,
    saveEdit,
    onSelectGame,
    onAddPlatform,
    onRemovePlatform,
    onSelectGenre,
    editingCard,
    editValue,
    setEditValue,
    isFavoriteGameEdit,
    isPlatformsEdit,
    isFavoriteGenreEdit,
    games,
    gamesLoading,
    gamesError,
    platformsList,
    platformsLoading,
    platformsError,
    selectedPlatforms,
    maxPlatforms,
    genresList,
    genresLoading,
    genresError,
  } = useProfileInfoCards();

  const config = CARD_CONFIG.find((c) => c.field === editingCard);

  return (
    <div className="gv-profile-info-cards">
      {CARD_CONFIG.map(({ field, label, icon }) => (
        <InfoCard
          key={field}
          label={label}
          value={getDisplayValue(field)}
          icon={icon}
          imageUrl={
            field === "favoriteGame"
              ? getDisplayCover()
              : field === "favoriteGenre"
                ? getDisplayGenreCover()
                : undefined
          }
          items={
            field === "platforms"
              ? getDisplayPlatforms().length
                ? getDisplayPlatforms().map((p) => ({
                    name: p.name,
                    imageUrl: p.imageUrl,
                  }))
                : undefined
              : undefined
          }
          onEdit={() => openEdit(field)}
        />
      ))}

      <Dialog
        header={config?.label?.replace(":", "") ?? "Editar"}
        visible={editingCard !== null}
        onHide={closeEdit}
        className="gv-profile-edit-dialog"
        contentStyle={{ padding: "0.25rem 1rem" }}
        pt={{
          header: { style: { padding: "0.5rem 1rem 0.25rem" } },
          content: { style: { padding: "0.25rem 1rem" } },
          footer: { style: { padding: "0.25rem 1rem 0.5rem" } },
        }}
        footer={
          <div className="gv-profile-edit-dialog-footer">
            <Button label="Cancelar" severity="secondary" onClick={closeEdit} />
            <Button label="Salvar" onClick={saveEdit} />
          </div>
        }
      >
        {isFavoriteGameEdit ? (
          <div className="gv-profile-game-favorite-dialog">
            <label className="gv-profile-game-list-label" htmlFor="game-search">
              Buscar jogo
            </label>
            <InputText
              id="game-search"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Digite o nome do jogo..."
              className="gv-profile-edit-input w-full"
              autoFocus
            />
            {gamesLoading && (
              <div className="gv-profile-dialog-games-loading">
                <i className="pi pi-spin pi-spinner" />
                Buscando jogos...
              </div>
            )}
            {gamesError && (
              <p className="gv-profile-dialog-games-error">{gamesError}</p>
            )}
            {!gamesLoading && !gamesError && games.length > 0 && (
              <>
                <p className="gv-profile-game-list-label">
                  Clique em um jogo para selecionar
                </p>
                <div className="gv-profile-dialog-games-list">
                  {games.map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      className="gv-profile-dialog-game-item"
                      onClick={() => onSelectGame(game)}
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
            {!gamesLoading &&
              !gamesError &&
              editValue.trim() &&
              games.length === 0 && (
                <p className="gv-profile-dialog-games-error">
                  Nenhum jogo encontrado.
                </p>
              )}
          </div>
        ) : isPlatformsEdit ? (
          <div className="gv-profile-game-favorite-dialog">
            <label
              className="gv-profile-game-list-label"
              htmlFor="platform-search"
            >
              Buscar plataforma (máx. {maxPlatforms} prediletas)
            </label>
            <InputText
              id="platform-search"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Digite para filtrar (ex.: PlayStation, Xbox...)"
              className="gv-profile-edit-input w-full"
              autoFocus
            />
            {selectedPlatforms.length > 0 && (
              <>
                <p className="gv-profile-game-list-label">
                  Selecionadas ({selectedPlatforms.length}/{maxPlatforms})
                </p>
                <div className="gv-profile-dialog-platforms-selected">
                  {selectedPlatforms.map((p, i) => (
                    <span
                      key={`${p.name}-${i}`}
                      className="gv-profile-dialog-platform-chip"
                    >
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="gv-profile-dialog-platform-chip-img"
                        />
                      )}
                      <span>{p.name}</span>
                      <button
                        type="button"
                        className="gv-profile-dialog-platform-chip-remove"
                        onClick={() => onRemovePlatform(i)}
                        aria-label="Remover"
                      >
                        <i className="pi pi-times" />
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
            {platformsLoading && (
              <div className="gv-profile-dialog-games-loading">
                <i className="pi pi-spin pi-spinner" />
                Carregando plataformas...
              </div>
            )}
            {platformsError && (
              <p className="gv-profile-dialog-games-error">{platformsError}</p>
            )}
            {!platformsLoading &&
              !platformsError &&
              platformsList.length > 0 && (
                <>
                  <p className="gv-profile-game-list-label">
                    Clique para adicionar à lista
                  </p>
                  <div className="gv-profile-dialog-games-list">
                    {platformsList.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        className="gv-profile-dialog-game-item"
                        onClick={() => onAddPlatform(platform)}
                      >
                        {platform.image && (
                          <img
                            src={platform.image}
                            alt=""
                            className="gv-profile-game-suggestion-img"
                          />
                        )}
                        <span className="gv-profile-game-suggestion-info">
                          <span className="gv-profile-game-suggestion-name">
                            {platform.name}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
          </div>
        ) : isFavoriteGenreEdit ? (
          <div className="gv-profile-game-favorite-dialog">
            <label
              className="gv-profile-game-list-label"
              htmlFor="genre-search"
            >
              Buscar gênero
            </label>
            <InputText
              id="genre-search"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Digite para filtrar (ex.: Action, RPG, Indie...)"
              className="gv-profile-edit-input w-full"
              autoFocus
            />
            {genresLoading && (
              <div className="gv-profile-dialog-games-loading">
                <i className="pi pi-spin pi-spinner" />
                Carregando gêneros...
              </div>
            )}
            {genresError && (
              <p className="gv-profile-dialog-games-error">{genresError}</p>
            )}
            {!genresLoading &&
              !genresError &&
              genresList.length > 0 && (
                <>
                  <p className="gv-profile-game-list-label">
                    Clique em um gênero para selecionar
                  </p>
                  <div className="gv-profile-dialog-games-list">
                    {genresList.map((genre) => (
                      <button
                        key={genre.id}
                        type="button"
                        className="gv-profile-dialog-game-item"
                        onClick={() => onSelectGenre(genre)}
                      >
                        {genre.image_background ? (
                          <img
                            src={genre.image_background}
                            alt=""
                            className="gv-profile-game-suggestion-img"
                          />
                        ) : (
                          <div className="gv-profile-game-suggestion-img gv-profile-game-suggestion-placeholder" />
                        )}
                        <span className="gv-profile-game-suggestion-info">
                          <span className="gv-profile-game-suggestion-name">
                            {genre.name}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            {!genresLoading &&
              !genresError &&
              editValue.trim() &&
              genresList.length === 0 && (
                <p className="gv-profile-dialog-games-error">
                  Nenhum gênero encontrado.
                </p>
              )}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
