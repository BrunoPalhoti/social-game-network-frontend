import { useAuthStore } from "@/shared/store/useAuthStore";
import { MissionStatus, JourneyTimeline, GenreHeatMap, JourneyMessage } from "./components";
import { useJourneyData } from "./hooks";
import { isZeradoStatus } from "./utils";
import "../../styles/Journey.css";

interface JourneyContentProps {
  year: number;
}

export function JourneyContent({ year }: JourneyContentProps) {
  const username = useAuthStore((s) => s.user?.username ?? "");
  const { data, loading, error, addGame, updateGame, clearAll } = useJourneyData(
    year,
    username,
  );

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

  const sortedGames = [...data.games].sort((a, b) => {
    if (!a.completedAt && !b.completedAt) return 0;
    if (!a.completedAt) return 1;
    if (!b.completedAt) return -1;
    return b.completedAt.localeCompare(a.completedAt);
  });

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
        jogosZeradosAno={sortedGames.filter((game) => isZeradoStatus(game.status))}
      />
      <GenreHeatMap data={data.genreHeatMap} />
    </div>
  );
}
