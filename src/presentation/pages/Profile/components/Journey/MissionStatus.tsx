import type { MissionStats, JogosZeradosNaVida } from "./types";
import "./Journey.css";

interface MissionStatusProps {
  stats: MissionStats;
  /** Resumo de jogos zerados na vida (horas, plataformas) */
  jogosZeradosNaVida?: JogosZeradosNaVida | null;
}

const items = [
  {
    key: "zerados" as const,
    icon: "🎮",
    label: "Jogos zerados no ano",
    value: (s: MissionStats) => s.jogosZeradosNoAno.toString(),
  },
  {
    key: "hours" as const,
    icon: "⏳",
    label: "Horas de Vida Investidas",
    value: (s: MissionStats) => `${s.totalHoursInvested}h`,
  },
  {
    key: "bosses" as const,
    icon: "⚔️",
    label: "Chefes Derrotados",
    value: (s: MissionStats) => s.bossesDefeated.toString(),
  },
];

export function MissionStatus({ stats, jogosZeradosNaVida }: MissionStatusProps) {
  return (
    <section className="gv-journey-mission-status" aria-label="Status da Missão">
      <h2 className="gv-journey-section-title">Status da Missão</h2>
      <div className="gv-journey-mission-cards">
        {items.map(({ key, icon, label, value }) => (
          <div key={key} className="gv-journey-mission-card">
            <span className="gv-journey-mission-icon" aria-hidden>
              {icon}
            </span>
            <div className="gv-journey-mission-content">
              <span className="gv-journey-mission-value">{value(stats)}</span>
              <span className="gv-journey-mission-label">{label}</span>
            </div>
          </div>
        ))}
      </div>
      {jogosZeradosNaVida && (
        <div className="gv-journey-vida-card">
          <h3 className="gv-journey-vida-title">Jogos zerados na vida</h3>
          <div className="gv-journey-vida-stats">
            <span className="gv-journey-vida-stat">
              <strong>{jogosZeradosNaVida.totalJogos}</strong> jogos
            </span>
            <span className="gv-journey-vida-stat">
              <strong>{jogosZeradosNaVida.totalHoras.toLocaleString("pt-BR")}h</strong> no total
            </span>
            {jogosZeradosNaVida.plataformas?.length > 0 && (
              <span className="gv-journey-vida-stat">
                <strong>{jogosZeradosNaVida.plataformas.join(", ")}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
