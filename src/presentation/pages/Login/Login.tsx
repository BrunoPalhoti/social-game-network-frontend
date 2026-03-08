import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ThemeToggle } from "../../components/ThemeToggle";
import "./Login.css";

function LogoIcon() {
  return (
    <svg
      className="login-logo-icon"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M32 8c-6 0-10 4-10 10v12c0 6 4 10 10 10h2v14h-4v4h16v-4h-4V42h2c6 0 10-4 10-10V18c0-6-4-10-10-10H32z"
        fill="currentColor"
      />
      <ellipse cx="24" cy="30" rx="4" ry="5" fill="var(--sgn-primary)" opacity="0.9" />
      <ellipse cx="40" cy="30" rx="4" ry="5" fill="var(--sgn-primary)" opacity="0.9" />
      <path
        d="M18 20v-2c0-4 3-8 6-8h16c3 0 6 4 6 8v2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrar com API de login
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-pattern" aria-hidden />
        <div className="login-bg-particles" aria-hidden />
        <div className="login-bg-glow" aria-hidden />
        <div className="login-bg-icon login-bg-icon-controller" aria-hidden />
        <div className="login-bg-icon login-bg-icon-headset" aria-hidden />
      </div>

      <div className="login-toggle">
        <ThemeToggle />
      </div>

      <div className="login-card-wrapper">
        <div className="login-card">
          <Link to="/" className="login-logo" aria-label="Voltar ao início">
            <LogoIcon />
            <h1 className="login-logo-text">
              <span className="login-logo-gamer">GAMER</span>
              <span className="login-logo-verse">VERSE</span>
            </h1>
          </Link>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de Usuário"
                className="login-input w-full"
                autoComplete="username"
              />
            </div>
            <div className="login-field">
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="login-password w-full"
                inputClassName="login-input w-full"
                toggleMask
                feedback={false}
                autoComplete="current-password"
              />
            </div>
            <div className="login-links-row">
              <Link to="/esqueci-senha" className="login-link">
                Esqueceu a senha?
              </Link>
            </div>
            <Button
              type="submit"
              label="ENTRAR"
              className="login-btn-entrar"
            />
            <div className="login-criar-conta">
              <Link to="/criar-conta" className="login-link">
                Criar Conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
