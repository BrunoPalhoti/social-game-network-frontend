import { FloatLabel } from "primereact/floatlabel";
import "./styles/Form.css";

export interface FormFieldProps {
  label: string;
  id: string;
  children: React.ReactNode;
  /** Quando true, usa FloatLabel (label flutuante); quando false, label acima do campo */
  floatLabel?: boolean;
  /** Classe CSS do wrapper do campo */
  fieldClassName?: string;
  /** Classe CSS do label (apenas quando floatLabel é false) */
  labelClassName?: string;
}

export function FormField({
  label,
  id,
  children,
  floatLabel = false,
  fieldClassName = "form-field",
  labelClassName,
}: FormFieldProps) {
  if (floatLabel) {
    return (
      <div className={fieldClassName}>
        <FloatLabel>
          {children}
          <label htmlFor={id}>{label}</label>
        </FloatLabel>
      </div>
    );
  }

  return (
    <div className={fieldClassName}>
      <label htmlFor={id} className={labelClassName ?? "form-label"}>
        {label}
      </label>
      {children}
    </div>
  );
}
