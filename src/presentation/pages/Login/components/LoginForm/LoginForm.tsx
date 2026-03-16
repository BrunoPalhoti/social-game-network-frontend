import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useAuthStore } from "@/shared/store/useAuthStore";
import {
  FormMessage,
  FormField,
  FormSubmitButton,
} from "@/presentation/components/Form";

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
      navigate("/profile");
    } else {
      setError("Usuário ou senha inválidos. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && (
        <FormMessage
          severity="error"
          text={error}
          className="login-error"
        />
      )}
      <FormField
        label="Nome de Usuário"
        id="username"
        floatLabel
        fieldClassName="login-field"
      >
        <InputText
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input w-full"
          autoComplete="username"
        />
      </FormField>
      <FormField
        label="Senha"
        id="password"
        floatLabel
        fieldClassName="login-field"
      >
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
      </FormField>
      {/* Links de recuperação de senha removidos enquanto não há rota correspondente */}
      <FormSubmitButton label="ENTRAR" className="login-btn-entrar" />
      {/* Seção de criação de conta removida enquanto não há rota correspondente */}
    </form>
  );
}
