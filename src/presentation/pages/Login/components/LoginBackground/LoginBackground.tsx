import { Tooltip } from "primereact/tooltip";
import { loginBackgroundIcons } from "./loginBackgroundIcons";
import "../../styles/LoginBackground.css";

export function LoginBackground() {
  return (
    <div className="login-bg">
      <Tooltip target=".login-bg-icon" position="top" />
      <div className="login-bg-pattern" aria-hidden />
      <div className="login-bg-particles" aria-hidden />
      <div className="login-bg-glow" aria-hidden />
      <div className="login-bg-gaming" aria-hidden>
        {loginBackgroundIcons.map(({ iconClass, delayClass }, i) => (
          <div
            key={`${iconClass}-${i}`}
            className={`login-bg-icon ${iconClass} login-bg-float ${delayClass}`}
            data-pr-tooltip={iconClass.replace("login-bg-icon-", "").replace(/-?\d*$/, "")}
          />
        ))}
      </div>
    </div>
  );
}
