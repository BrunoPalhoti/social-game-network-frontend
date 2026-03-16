import { type RawgGame } from "@/shared/api/rawgApi";

interface RawgGameSuggestionListProps {
  games: RawgGame[];
  emptyQuery: string;
  heading: string;
  onSelect(game: RawgGame): void;
}

export function RawgGameSuggestionList({
  games,
  emptyQuery,
  heading,
  onSelect,
}: RawgGameSuggestionListProps) {
  const hasResults = games.length > 0;
  const hasQuery = emptyQuery.trim().length > 0;

  if (!hasResults && !hasQuery) {
    return null;
  }

  if (!hasResults && hasQuery) {
    return (
      <p className="gv-profile-dialog-games-error">Nenhum jogo encontrado.</p>
    );
  }

  return (
    <>
      <p className="gv-profile-game-list-label">{heading}</p>
      <div className="gv-profile-dialog-games-list">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            className="gv-profile-dialog-game-item"
            onClick={() => onSelect(game)}
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
  );
}

