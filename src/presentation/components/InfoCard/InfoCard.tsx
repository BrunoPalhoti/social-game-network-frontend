import "./InfoCard.css";

export interface InfoCardProps {
  label: string;
  value: string;
  icon: string;
}

export function InfoCard({ label, value, icon }: InfoCardProps) {
  return (
    <div className="gv-info-card">
      <div className="gv-info-card-icon">
        <i className={icon} />
      </div>
      <div className="gv-info-card-content">
        <span className="gv-info-card-label">{label}</span>
        <span className="gv-info-card-value">{value}</span>
      </div>
    </div>
  );
}
