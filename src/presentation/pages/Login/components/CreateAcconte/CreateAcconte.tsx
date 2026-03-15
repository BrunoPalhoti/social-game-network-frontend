import { GamerVerseLogo } from "@/presentation/components/GamerVerseLogo";
import { Card } from "primereact/card";
import "../../styles/LoginCard.css";
import { CreateAccountForm } from "./CreateAccountForm";

export function CreateAcconte() {
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
        <CreateAccountForm />
      </Card>
    </div>
  );
}
