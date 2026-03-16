import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/shared/store/useAuthStore";

export function useLoginForm() {
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

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}

