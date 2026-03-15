import { useMemo } from "react";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { getMockJourneyData } from "./journeyData";
import { MissionStatus } from "./MissionStatus";
import { JourneyTimeline } from "./JourneyTimeline";
import { GenreHeatMap } from "./GenreHeatMap";
import { JourneyGameCard } from "./JourneyGameCard";
import "../../styles/Journey.css";

interface JourneyContentProps {
  year: number;
}

export function JourneyContent({ year }: JourneyContentProps) {
  const data = useMemo(() => getMockJourneyData(year), [year]);

  return (
    <div className="gv-journey" data-journey-year={year}>
      <MissionStatus
        stats={data.missionStats}
        jogosZeradosNaVida={data.jogosZeradosNaVida}
      />
      <JourneyTimeline months={data.months} />
      <GenreHeatMap data={data.genreHeatMap} />

      <Card
        title="Sua odisseia em jogos"
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
          {data.games.map((game) => (
            <JourneyGameCard key={game.id} game={game} />
          ))}
        </div>
      </Card>

      <Message
        severity="info"
        className="gv-journey-gamification"
        text={
          <>
            🎨 <strong>Gamificação:</strong> Zerou 10+ jogos no ano? Seu perfil
            pode ganhar um detalhe{" "}
            <span className="gv-journey-theme-gold">Dourado</span>. Jogou muito
            terror? O tema pode ficar{" "}
            <span className="gv-journey-theme-blood">Vermelho Sangue</span>.
          </>
        }
        aria-label="Tema desbloqueável"
      />
    </div>
  );
}
