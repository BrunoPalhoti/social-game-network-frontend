import { Card } from "primereact/card";
import type { JourneyGame } from "../../types";
import { JourneyGameCard } from "../JourneyGameCard";
import "../../../../styles/Journey.css";

interface JourneyGamesSectionProps {
  games: JourneyGame[];
}

export function JourneyGamesSection({ games }: JourneyGamesSectionProps) {
  return (
    <>
      <Card
        title="Seus jogos da jornada"
        className="gv-journey-games-section"
        aria-label="Todos os jogos da jornada"
        pt={{
          header: { className: "gv-journey-games-card-header" },
          body: { className: "gv-journey-games-card-body" },
          title: { className: "gv-journey-games-card-title" },
        }}
      >
        <p className="gv-journey-games-intro">
          Passe o mouse sobre um card para ver a{" "}
          <strong>Análise de 1 minuto</strong>.
        </p>
        <div className="gv-journey-games-grid">
          {games.map((game) => (
            <JourneyGameCard key={game.id} game={game} />
          ))}
        </div>
      </Card>
    </>
  );
}
