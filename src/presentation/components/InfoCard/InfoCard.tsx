import { Card } from "primereact/card";
import "./styles/InfoCard.css";

/** Item com nome e logo (ex.: plataforma). */
export interface InfoCardItem {
  name: string;
  imageUrl?: string | null;
}

export interface InfoCardProps {
  label: string;
  value: string;
  icon: string;
  /** URL da capa do jogo (ex.: game favorito da RAWG) */
  imageUrl?: string | null;
  /** Lista de itens com logo (ex.: plataformas). Quando definido, exibe estes em vez de só value. */
  items?: InfoCardItem[];
  onEdit?: () => void;
}

export function InfoCard({ label, value, icon, imageUrl, items, onEdit }: InfoCardProps) {
  const hasItems = items && items.length > 0;
  return (
    <Card
      className={`gv-info-card ${imageUrl ? "gv-info-card--with-image" : ""} ${hasItems ? "gv-info-card--with-items" : ""}`}
      pt={{ body: { className: "gv-info-card-body" } }}
    >
      <div className="gv-info-card-inner">
        {hasItems ? (
          <div className="gv-info-card-icon">
            <i className={icon} />
          </div>
        ) : imageUrl ? (
          <div className="gv-info-card-cover">
            <img src={imageUrl} alt="" className="gv-info-card-cover-img" />
          </div>
        ) : (
          <div className="gv-info-card-icon">
            <i className={icon} />
          </div>
        )}
        <div className="gv-info-card-content">
          <span className="gv-info-card-label">{label}</span>
          {hasItems ? (
            <div className="gv-info-card-items">
              {items!.map((item, i) => (
                <div key={i} className="gv-info-card-item">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="gv-info-card-item-img"
                    />
                  )}
                  <span className="gv-info-card-item-name">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="gv-info-card-value">{value}</span>
          )}
        </div>
        {onEdit && (
          <button
            type="button"
            className="gv-info-card-edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Editar"
          >
            <i className="pi pi-pencil" />
          </button>
        )}
      </div>
    </Card>
  );
}
