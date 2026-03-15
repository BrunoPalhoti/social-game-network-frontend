import { useLocation } from "react-router-dom";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LoginBackground } from "./components/LoginBackground";
import { LoginCard } from "./components/LoginCard";
import { CreateAcconte } from "./components/CreateAcconte";
import "./styles/Login.css";

export default function Login() {
  const { pathname } = useLocation();
  const isCreateAccount = pathname === "/criar-conta";

  return (
    <div className="login-page">
      <LoginBackground />

      <div className="login-toggle">
        <ThemeToggle />
      </div>

      {isCreateAccount ? <CreateAcconte /> : <LoginCard />}
    </div>
  );
}
