import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ThemeToggle } from "../../components/ThemeToggle";
import { GamerVerseLogo } from "../../components/GamerVerseLogo";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { loginBackgroundIcons } from "./loginBackgroundIcons";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("bruno.palhoti");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const success = login(username, password);
    if (success) {
      navigate("/home");
    } else {
      setError("Usuário ou senha inválidos. Tente novamente.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-pattern" aria-hidden />
        <div className="login-bg-particles" aria-hidden />
        <div className="login-bg-glow" aria-hidden />
        <div className="login-bg-gaming" aria-hidden>
          {loginBackgroundIcons.map(({ iconClass, delayClass }, i) => (
            <div
              key={`${iconClass}-${i}`}
              className={`login-bg-icon ${iconClass} login-bg-float ${delayClass}`}
            />
          ))}
        </div>
      </div>

      <div className="login-toggle">
        <ThemeToggle />
      </div>

      <div className="login-card-wrapper">
        <div className="login-card">
          <GamerVerseLogo className="login-logo-wrap" showTagline />

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <Message severity="error" text={error} className="login-error" />
            )}
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
            <Button type="submit" label="ENTRAR" className="login-btn-entrar" />
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
