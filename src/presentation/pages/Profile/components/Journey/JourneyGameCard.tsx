import type { JourneyGame } from "./types";
import "./Journey.css";

interface JourneyGameCardProps {
  game: JourneyGame;
  compact?: boolean;
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function JourneyGameCard({ game, compact }: JourneyGameCardProps) {
  if (compact) {
    return (
      <div className="gv-journey-card gv-journey-card--compact">
        <span className="gv-journey-card-title">{game.name}</span>
        {game.completedAt && (
          <span className="gv-journey-card-date">
            Concluído: {formatDate(game.completedAt)}
          </span>
        )}
        {game.rating != null && (
          <span className="gv-journey-card-rating">⭐ {game.rating}/10</span>
        )}
      </div>
    );
  }

  return (
    <article className="gv-journey-card gv-journey-card--full">
      <div className="gv-journey-card-cover-wrap">
        <img
          src={game.coverImageUrl}
          alt=""
          className="gv-journey-card-cover"
        />
        <div className="gv-journey-card-overlay">
          <div className="gv-journey-card-analysis">
            <p className="gv-journey-card-analysis-label">Análise de 1 minuto</p>
            {game.verdict && (
              <p className="gv-journey-card-verdict">&ldquo;{game.verdict}&rdquo;</p>
            )}
            {game.notes && (
              <p className="gv-journey-card-notes">{game.notes}</p>
            )}
          </div>
        </div>
        {game.is100Percent && (
          <span className="gv-journey-card-badge">100%</span>
        )}
        {game.status === "PLATINUM" && (
          <span className="gv-journey-card-badge gv-journey-card-badge--platina">
            Platina
          </span>
        )}
      </div>
      <div className="gv-journey-card-body">
        <h3 className="gv-journey-card-title">{game.name}</h3>
        {game.completedAt && (
          <p className="gv-journey-card-meta">
            Data de conclusão: {formatDate(game.completedAt)}
          </p>
        )}
        {game.verdict && (
          <p className="gv-journey-card-verdict-inline">
            Veredito: &ldquo;{game.verdict}&rdquo;
          </p>
        )}
        <div className="gv-journey-card-footer">
          {game.rating != null && (
            <span className="gv-journey-card-rating">⭐ {game.rating}/10</span>
          )}
          {game.hoursPlayed != null && (
            <span className="gv-journey-card-hours">⏳ {game.hoursPlayed}h</span>
          )}
        </div>
      </div>
    </article>
  );
}
