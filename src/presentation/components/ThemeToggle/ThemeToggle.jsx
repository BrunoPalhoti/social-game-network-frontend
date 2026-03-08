import { Button } from "primereact/button";
import { useTheme } from "../../../shared/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      icon={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
      onClick={toggleTheme}
      rounded
      text
      severity="secondary"
      aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
      title={theme === "dark" ? "Tema claro" : "Tema escuro"}
    />
  );
}
