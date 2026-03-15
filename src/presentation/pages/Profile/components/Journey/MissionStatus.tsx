import { Card } from "primereact/card";
import type { MissionStats, JogosZeradosNaVida } from "./types";
import "../../styles/Journey.css";

interface MissionStatusProps {
  stats: MissionStats;
  /** Resumo de jogos zerados na vida (horas, plataformas) — mesclado no Status da Missão */
  jogosZeradosNaVida?: JogosZeradosNaVida | null;
}

const itemsAno = [
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

function MissionStatCard({
  icon,
  label,
  value,
  valueSmall,
}: {
  icon: string;
  label: string;
  value: string;
  valueSmall?: boolean;
}) {
  return (
    <Card className="gv-journey-mission-card" pt={{ body: { className: "gv-journey-mission-card-body" } }}>
      <div className="gv-journey-mission-card-inner">
        <span className="gv-journey-mission-icon" aria-hidden>
          {icon}
        </span>
        <div className="gv-journey-mission-content">
          <span className={valueSmall ? "gv-journey-mission-value gv-journey-mission-value--small" : "gv-journey-mission-value"}>
            {value}
          </span>
          <span className="gv-journey-mission-label">{label}</span>
        </div>
      </div>
    </Card>
  );
}

export function MissionStatus({ stats, jogosZeradosNaVida }: MissionStatusProps) {
  return (
    <section className="gv-journey-mission-status" aria-label="Status da Missão">
      <h2 className="gv-journey-section-title">Status da Missão</h2>
      <div className="gv-journey-mission-cards">
        {itemsAno.map(({ key, icon, label, value }) => (
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
            {jogosZeradosNaVida.plataformas?.length > 0 && (
              <MissionStatCard
                icon="🖥️"
                label="Plataformas"
                value={jogosZeradosNaVida.plataformas.join(", ")}
                valueSmall
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
