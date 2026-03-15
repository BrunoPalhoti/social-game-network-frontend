import { Card } from "primereact/card";
import "../../../../styles/Journey.css";

interface MissionStatCardProps {
  icon: string;
  label: string;
  value: string;
  valueSmall?: boolean;
}

export function MissionStatCard({
  icon,
  label,
  value,
  valueSmall,
}: MissionStatCardProps) {
  return (
    <Card
      className="gv-journey-mission-card"
      pt={{ body: { className: "gv-journey-mission-card-body" } }}
    >
      <div className="gv-journey-mission-card-inner">
        <span className="gv-journey-mission-icon" aria-hidden>
          {icon}
        </span>
        <div className="gv-journey-mission-content">
          <span
            className={
              valueSmall
                ? "gv-journey-mission-value gv-journey-mission-value--small"
                : "gv-journey-mission-value"
            }
          >
            {value}
          </span>
          <span className="gv-journey-mission-label">{label}</span>
        </div>
      </div>
    </Card>
  );
}
