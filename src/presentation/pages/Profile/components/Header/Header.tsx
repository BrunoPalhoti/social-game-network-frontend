import { getInitialsFromName, useAuthStore } from "@/shared/store/useAuthStore";
import { GamerVerseLogo } from "@/presentation/components/GamerVerseLogo/GamerVerseLogo";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const avatarLabel = user ? getInitialsFromName(user.name) : "?";

  return (
    <header className="gv-header">
      <div className="gv-header-logo">
        <GamerVerseLogo
          asLink
          className="gv-header-logo-link"
          showTagline={false}
        />
      </div>

      <div className="gv-header-search">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            placeholder="Search"
            className="gv-header-search-input"
            aria-label="Buscar"
          />
        </IconField>
      </div>

      <div className="gv-header-actions">
        <Button
          icon="pi pi-bell"
          rounded
          text
          severity="secondary"
          aria-label="Notificações"
          className="gv-header-icon-btn"
        />
        <Button
          icon="pi pi-envelope"
          rounded
          text
          severity="secondary"
          aria-label="Mensagens"
          className="gv-header-icon-btn"
        />
        <Button
          rounded
          text
          severity="secondary"
          aria-label="Perfil do usuário"
          className="gv-header-avatar-btn p-button-plain"
        >
          <Avatar
            label={avatarLabel}
            className="gv-header-avatar"
            shape="circle"
          />
        </Button>
      </div>
    </header>
  );
}
