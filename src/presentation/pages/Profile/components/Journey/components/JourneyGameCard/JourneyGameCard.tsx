import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import type { JourneyGame } from "../../types";
import { formatJourneyDate } from "../../utils";
import "../../../../styles/Journey.css";

interface JourneyGameCardProps {
  game: JourneyGame;
  compact?: boolean;
}

export function JourneyGameCard({ game, compact }: JourneyGameCardProps) {
  if (compact) {
    return (
      <Card
        className="gv-journey-card gv-journey-card--compact"
        pt={{
          root: { className: "gv-journey-card gv-journey-card--compact" },
          body: {
            className: "gv-journey-card-body",
            style: { padding: "0.5rem 0" },
          },
          content: { style: { padding: 0 } },
        }}
      >
        <span className="gv-journey-card-title">{game.name}</span>
        {game.completedAt && (
          <span className="gv-journey-card-date">
            Concluído: {formatJourneyDate(game.completedAt)}
          </span>
        )}
        {game.platform && (
          <span className="gv-journey-card-platform">🎮 {game.platform}</span>
        )}
        {game.hoursPlayed != null && game.hoursPlayed > 0 && (
          <span className="gv-journey-card-hours">⏳ {game.hoursPlayed}h</span>
        )}
        {game.rating != null && (
          <span className="gv-journey-card-rating">⭐ {game.rating}/10</span>
        )}
      </Card>
    );
  }

  const header = (
    <div className="gv-journey-card-cover-wrap">
      <img src={game.coverImageUrl} alt="" className="gv-journey-card-cover" />
      <div className="gv-journey-card-overlay">
        <div className="gv-journey-card-analysis">
          <p className="gv-journey-card-analysis-label">Análise de 1 minuto</p>
          {game.verdict && (
            <p className="gv-journey-card-verdict">
              &ldquo;{game.verdict}&rdquo;
            </p>
          )}
          {game.notes && <p className="gv-journey-card-notes">{game.notes}</p>}
        </div>
      </div>
      {game.is100Percent && (
        <Tag
          value="100%"
          className="gv-journey-card-badge gv-journey-card-badge--100"
        />
      )}
      {game.status === "PLATINUM" && (
        <Tag
          value="Platina"
          severity="warning"
          className="gv-journey-card-badge gv-journey-card-badge--platina"
        />
      )}
    </div>
  );

  const footer = (
    <div className="gv-journey-card-footer">
      {game.rating != null && (
        <span className="gv-journey-card-rating">⭐ {game.rating}/10</span>
      )}
      {game.hoursPlayed != null && (
        <span className="gv-journey-card-hours">⏳ {game.hoursPlayed}h</span>
      )}
    </div>
  );

  return (
    <Card
      className="gv-journey-card gv-journey-card--full"
      header={header}
      footer={footer}
      pt={{
        body: { className: "gv-journey-card-body" },
        header: { className: "gv-journey-card-header-wrap" },
        footer: { className: "gv-journey-card-footer-wrap" },
      }}
    >
      <h3 className="gv-journey-card-title">{game.name}</h3>
      {game.completedAt && (
        <p className="gv-journey-card-meta">
          Data de conclusão: {formatJourneyDate(game.completedAt)}
        </p>
      )}
      {game.verdict && (
        <p className="gv-journey-card-verdict-inline">
          Veredito: &ldquo;{game.verdict}&rdquo;
        </p>
      )}
    </Card>
  );
}
