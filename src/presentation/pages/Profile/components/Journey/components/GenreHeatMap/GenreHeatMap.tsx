import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import type { GenreShare } from "../../types";
import "../../../../styles/Journey.css";

interface GenreHeatMapProps {
  data: GenreShare[];
}

export function GenreHeatMap({ data }: GenreHeatMapProps) {
  const maxPercent = Math.max(...data.map((d) => d.percent), 1);

  return (
    <Card
      title="Onde você mais morou este ano"
      className="gv-journey-genre-heatmap"
      aria-label="Mapa de calor de gêneros"
      pt={{
        header: { className: "gv-journey-genre-card-header" },
        body: { className: "gv-journey-genre-card-body" },
        title: { className: "gv-journey-genre-card-title" },
      }}
    >
      <p className="gv-journey-genre-subtitle">
        Distribuição por gênero (horas investidas)
      </p>
      <div className="gv-journey-genre-bars">
        {data.map((item) => (
          <div key={item.genre} className="gv-journey-genre-row">
            <span className="gv-journey-genre-name">{item.genre}</span>
            <ProgressBar
              value={(item.percent / maxPercent) * 100}
              showValue={false}
              className="gv-journey-genre-bar-wrap"
              pt={{
                value: { className: "gv-journey-genre-bar-fill" },
              }}
            />
            <span className="gv-journey-genre-percent">{item.percent}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
