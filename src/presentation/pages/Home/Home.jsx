import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: 800,
        margin: "0 auto",
        backgroundColor: "var(--sgn-bg)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <ThemeToggle />
      </div>
      <Card
        title="Social Game Network"
        subTitle="Bem-vindo"
        style={{
          marginBottom: "1rem",
          backgroundColor: "var(--sgn-surface)",
          borderColor: "var(--sgn-border)",
          boxShadow: "var(--sgn-card-shadow)",
        }}
      >
        <p
          style={{
            margin: "0 0 1.5rem 0",
            lineHeight: 1.6,
            color: "var(--sgn-text)",
          }}
        >
          Conecte-se com jogadores, descubra novos games e compartilhe suas
          partidas.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button label="Entrar" icon="pi pi-sign-in" onClick={() => navigate("/login")} />
          <Button
            label="Cadastrar"
            icon="pi pi-user-plus"
            className="p-button-outlined"
          />
        </div>
      </Card>
    </div>
  );
}
