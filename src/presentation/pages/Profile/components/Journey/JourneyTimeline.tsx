import type { JourneyMonth } from "./types";
import type { JourneyGame } from "./types";
import { JourneyGameCard } from "./JourneyGameCard";
import "./Journey.css";

const ZERADOS_STATUS: JourneyGame["status"][] = ["COMPLETED", "PLATINUM"];

function isZerado(game: JourneyGame) {
  return ZERADOS_STATUS.includes(game.status);
}

interface JourneyTimelineProps {
  months: JourneyMonth[];
}

function TimelineGameSlot({
  game,
  badge,
}: {
  game: JourneyGame;
  badge?: "zerado" | "playing";
}) {
  const isPlaying = badge === "playing";
  return (
    <div
      key={game.id}
      className={`gv-journey-timeline-game-slot ${isPlaying ? "gv-journey-timeline-game-slot--playing" : ""}`}
    >
      <div className="gv-journey-timeline-cover-wrap">
        <img
          src={game.coverImageUrl}
          alt=""
          className="gv-journey-timeline-cover"
        />
        {isPlaying ? (
          <span className="gv-journey-badge-playing">Jogando agora</span>
        ) : (
          <>
            {game.is100Percent && (
              <span className="gv-journey-badge-100">100%</span>
            )}
            {game.status === "PLATINUM" && (
              <span className="gv-journey-badge-platina">Platina</span>
            )}
          </>
        )}
      </div>
      <JourneyGameCard game={game} compact />
    </div>
  );
}

export function JourneyTimeline({ months }: JourneyTimelineProps) {
  const jogosZerados: JourneyGame[] = [];
  const jogandoAgora: JourneyGame[] = [];

  months.forEach((month) => {
    month.games.forEach((game) => {
      if (isZerado(game)) jogosZerados.push(game);
      else if (game.status === "PLAYING") jogandoAgora.push(game);
    });
  });

  return (
    <section className="gv-journey-timeline-wrap" aria-label="Linha do tempo">
      <h2 className="gv-journey-section-title">Linha do Tempo</h2>

      {/* 1. Jogos que já zerei */}
      <div className="gv-journey-timeline-block">
        <h3 className="gv-journey-timeline-block-title">
          Jogos que já zerei
        </h3>
        <div className="gv-journey-timeline-scroll">
          <div className="gv-journey-timeline-track">
            {jogosZerados.length > 0 ? (
              jogosZerados.map((game) => (
                <TimelineGameSlot key={game.id} game={game} badge="zerado" />
              ))
            ) : (
              <p className="gv-journey-timeline-empty">
                Nenhum jogo zerado neste ano ainda.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Jogos que estou jogando no momento */}
      <div className="gv-journey-timeline-block">
        <h3 className="gv-journey-timeline-block-title gv-journey-timeline-block-title--playing">
          Jogos que estou jogando no momento
        </h3>
        <div className="gv-journey-timeline-scroll">
          <div className="gv-journey-timeline-track">
            {jogandoAgora.length > 0 ? (
              jogandoAgora.map((game) => (
                <TimelineGameSlot key={game.id} game={game} badge="playing" />
              ))
            ) : (
              <p className="gv-journey-timeline-empty">
                Nenhum jogo em andamento.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
