import { Message } from "primereact/message";
import "../../../../styles/Journey.css";

type Severity = "info" | "warn" | "error";

interface JourneyMessageProps {
  severity: Severity;
  year?: number;
  children: React.ReactNode;
  className?: string;
}

export function JourneyMessage({ severity, year, children, className }: JourneyMessageProps) {
  const message = (
    <Message severity={severity} className={className ?? "gv-journey-loading"}>
      {children}
    </Message>
  );
  if (year != null) {
    return (
      <div className="gv-journey" data-journey-year={year}>
        {message}
      </div>
    );
  }
  return message;
}
