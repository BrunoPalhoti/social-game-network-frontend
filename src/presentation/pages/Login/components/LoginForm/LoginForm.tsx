import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { FloatLabel } from "primereact/floatlabel";
import { Divider } from "primereact/divider";
import { useAuthStore } from "@/shared/store/useAuthStore";

export function LoginForm() {
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
    <form onSubmit={handleSubmit} className="login-form">
      {error && (
        <Message severity="error" text={error} className="login-error" />
      )}
      <div className="login-field">
        <FloatLabel>
          <InputText
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input w-full"
            autoComplete="username"
          />
          <label htmlFor="username">Nome de Usuário</label>
        </FloatLabel>
      </div>
      <div className="login-field">
        <FloatLabel>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-password w-full"
            inputClassName="login-input w-full"
            toggleMask
            feedback={false}
            autoComplete="current-password"
          />
          <label htmlFor="password">Senha</label>
        </FloatLabel>
      </div>
      <div className="login-links-row">
        <Link to="/esqueci-senha" className="login-link">
          Esqueceu a senha?
        </Link>
      </div>
      <Button type="submit" label="ENTRAR" className="login-btn-entrar" />
      <Divider align="center" type="dashed">
        <span className="login-divider-text">ou</span>
      </Divider>
      <div className="login-criar-conta">
        <Link to="/criar-conta" className="login-link">
          Criar Conta
        </Link>
      </div>
    </form>
  );
}
