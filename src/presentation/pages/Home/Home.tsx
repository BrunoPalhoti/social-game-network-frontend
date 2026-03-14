import { Card } from "primereact/card";
import "./Home.css";

export default function Home() {
  return (
    <>
      <header className="gv-page-header">
        <h2 className="gv-page-title">Feed</h2>
        <p className="gv-page-subtitle">
          Veja o que a comunidade GamerVerse está jogando agora.
        </p>
      </header>

      <section className="gv-page-content">
        <Card className="gv-home-placeholder-card">
          <p className="gv-home-placeholder-text">
            Seu feed aparecerá aqui em breve.
          </p>
        </Card>
      </section>
    </>
  );
}
