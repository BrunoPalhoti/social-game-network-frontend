import { Card } from "primereact/card";
import { GamerVerseLogo } from "@/presentation/components/GamerVerseLogo";
import { LoginForm } from "../LoginForm";
import "../../styles/LoginCard.css";

export function LoginCard() {
  return (
    <div className="login-card-wrapper">
      <Card
        className="login-card"
        pt={{
          body: { className: "login-card-body" },
          content: { className: "login-card-content" },
        }}
      >
        <GamerVerseLogo className="login-logo-wrap" showTagline />
        <LoginForm />
      </Card>
    </div>
  );
}
