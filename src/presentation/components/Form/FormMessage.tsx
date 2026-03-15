import { Message } from "primereact/message";

export type FormMessageSeverity = "error" | "success" | "info" | "warn";

export interface FormMessageProps {
  severity: FormMessageSeverity;
  text: string;
  className?: string;
}

export function FormMessage({ severity, text, className }: FormMessageProps) {
  return (
    <Message
      severity={severity}
      text={text}
      className={className ?? "form-message"}
    />
  );
}
