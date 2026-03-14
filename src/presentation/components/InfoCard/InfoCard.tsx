import { Card } from "primereact/card";
import "./InfoCard.css";

export interface InfoCardProps {
  label: string;
  value: string;
  icon: string;
}

export function InfoCard({ label, value, icon }: InfoCardProps) {
  return (
    <Card className="gv-info-card" pt={{ body: { className: "gv-info-card-body" } }}>
      <div className="gv-info-card-inner">
        <div className="gv-info-card-icon">
          <i className={icon} />
        </div>
        <div className="gv-info-card-content">
          <span className="gv-info-card-label">{label}</span>
          <span className="gv-info-card-value">{value}</span>
        </div>
      </div>
    </Card>
  );
}
