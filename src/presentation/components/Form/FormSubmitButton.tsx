import { Button } from "primereact/button";

export interface FormSubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSubmitButton({
  label,
  loading = false,
  disabled = false,
  className,
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      label={loading ? "Salvando…" : label}
      className={className}
      loading={loading}
      disabled={disabled || loading}
    />
  );
}
