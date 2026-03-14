import { Card } from "primereact/card";
import { Sidebar } from "@/presentation/components/Sidebar/Sidebar";
import "./Home.css";

export default function Home() {
  return (
    <div className="gv-home">
      <Sidebar />

      <main className="gv-home-main">
        <header className="gv-home-header">
          <h2 className="gv-home-title">Feed</h2>
          <p className="gv-home-subtitle">
            Veja o que a comunidade GamerVerse está jogando agora.
          </p>
        </header>

        <section className="gv-home-content">
          <Card className="gv-home-placeholder-card">
            <p className="gv-home-placeholder-text">
              Seu feed aparecerá aqui em breve.
            </p>
          </Card>
        </section>
      </main>
    </div>
  );
}
