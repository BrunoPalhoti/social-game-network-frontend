import { useAuthStore } from "@/shared/store/useAuthStore";
import {
  MissionStatus,
  JourneyTimeline,
  GenreHeatMap,
  JourneyGamesSection,
  JourneyMessage,
} from "./components";
import { useJourneyData } from "./hooks";
import "../../styles/Journey.css";

interface JourneyContentProps {
  year: number;
}

export function JourneyContent({ year }: JourneyContentProps) {
  const username = useAuthStore((s) => s.user?.username ?? "");
  const { data, loading, error, addGame, updateGame, clearAll } = useJourneyData(year, username);

  if (!username) {
    return (
      <JourneyMessage severity="warn" year={year}>
        Faça login para ver e salvar sua jornada.
      </JourneyMessage>
    );
  }
  if (loading) {
    return (
      <JourneyMessage severity="info" year={year}>
        Carregando jornada…
      </JourneyMessage>
    );
  }
  if (error) {
    return (
      <JourneyMessage severity="error" year={year} className="gv-journey-error">
        Não foi possível carregar a jornada. {error.message}
      </JourneyMessage>
    );
  }
  if (!data) return null;

  return (
    <div className="gv-journey" data-journey-year={year}>
      <MissionStatus
        stats={data.missionStats}
        jogosZeradosNaVida={data.jogosZeradosNaVida}
      />
      <JourneyTimeline
        months={data.months}
        year={data.year}
        addGame={addGame}
        updateGame={updateGame}
        clearAll={clearAll}
      />
      <GenreHeatMap data={data.genreHeatMap} />
      <JourneyGamesSection games={data.games} />
    </div>
  );
}
