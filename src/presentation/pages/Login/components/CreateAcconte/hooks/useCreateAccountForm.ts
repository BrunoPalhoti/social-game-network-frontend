import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "@/shared/api/mockUsersApi";
import { useAuthStore } from "@/shared/store/useAuthStore";

export function useCreateAccountForm() {
  const navigate = useNavigate();
  const loginCreatedUser = useAuthStore((s) => s.loginCreatedUser);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username.trim() || !email.trim()) {
      setError("Preencha username e e-mail.");
      return;
    }
    setLoading(true);
    try {
      const user = await createAccount({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      loginCreatedUser({
        username: user.username,
        name: user.name,
        nickname: user.nickname,
        platforms: user.platform
          ? [{ name: user.platform, imageUrl: null }]
          : undefined,
        favoriteGame: user.favoriteGame,
      });
      setSuccess("Conta criada! (dados salvos localmente para simulação)");
      setUsername("");
      setEmail("");
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    success,
    loading,
    handleSubmit,
  };
}
