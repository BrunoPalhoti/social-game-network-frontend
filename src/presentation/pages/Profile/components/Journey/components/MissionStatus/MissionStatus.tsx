import type { MissionStats, JogosZeradosNaVida } from "../../types";
import { MissionStatCard } from "../MissionStatCard";
import "../../../../styles/Journey.css";

const ITEMS_ANO = [
  {
    key: "zerados" as const,
    icon: "🎮",
    label: "Jogos zerados no ano",
    value: (s: MissionStats) => s.jogosZeradosNoAno.toString(),
  },
  {
    key: "hours" as const,
    icon: "⏳",
    label: "Horas investidas no ano",
    value: (s: MissionStats) => `${s.totalHoursInvested}h`,
  },
];

interface MissionStatusProps {
  stats: MissionStats;
  jogosZeradosNaVida?: JogosZeradosNaVida | null;
}

export function MissionStatus({ stats, jogosZeradosNaVida }: MissionStatusProps) {
  return (
    <section className="gv-journey-mission-status" aria-label="Status da Missão">
      <h2 className="gv-journey-section-title">Status da Missão</h2>
      <div className="gv-journey-mission-cards">
        {ITEMS_ANO.map(({ key, icon, label, value }) => (
          <MissionStatCard
            key={key}
            icon={icon}
            label={label}
            value={value(stats)}
          />
        ))}
        {jogosZeradosNaVida && (
          <>
            <MissionStatCard
              icon="🏆"
              label="Jogos zerados na vida"
              value={jogosZeradosNaVida.totalJogos.toString()}
            />
            <MissionStatCard
              icon="⏳"
              label="Horas totais na vida"
              value={`${jogosZeradosNaVida.totalHoras.toLocaleString("pt-BR")}h`}
            />
          </>
        )}
      </div>
    </section>
  );
}
