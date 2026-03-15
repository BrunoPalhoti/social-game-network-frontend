import { ThemeToggle } from "../../components/ThemeToggle";
import { LoginBackground } from "./components/LoginBackground";
import { LoginCard } from "./components/LoginCard";
import "./styles/Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <LoginBackground />

      <div className="login-toggle">
        <ThemeToggle />
      </div>

      <LoginCard />
    </div>
  );
}
