import { getInitialsFromName, useAuthStore } from "@/shared/store/useAuthStore";
import { NavLink } from "react-router-dom";
import { Button } from "primereact/button";
import { GamerVerseLogo } from "../GamerVerseLogo/GamerVerseLogo";
import "./Sidebar.css";

const navItems = [
  { to: "/home", label: "Feed", icon: "pi pi-home" },
  { to: "/friends", label: "Friends", icon: "pi pi-user-plus" },
  { to: "/profile", label: "Profile", icon: "pi pi-user" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name ?? user?.username ?? "Usuário";
  const initials = user ? getInitialsFromName(user.name) : "?";

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      <div
        className={`gv-sidebar-overlay ${open ? "gv-sidebar-overlay--visible" : ""}`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside className={`gv-sidebar ${open ? "gv-sidebar--open" : ""}`}>
        {onClose && (
          <Button
            icon="pi pi-times"
            rounded
            text
            severity="secondary"
            aria-label="Fechar menu"
            className="gv-sidebar-close"
            onClick={onClose}
          />
        )}
      <div className="gv-sidebar-top">
        <GamerVerseLogo
          asLink
          className="gv-sidebar-logo"
          showTagline={false}
        />

        <nav className="gv-sidebar-nav" aria-label="Navegação principal" onClick={handleNavClick}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "gv-sidebar-nav-item",
                  isActive ? "gv-sidebar-nav-item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="gv-sidebar-nav-icon" aria-hidden>
                <i className={item.icon} />
              </span>
              <span className="gv-sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="gv-sidebar-bottom">
        <Button
          className="gv-sidebar-profile p-button-text p-button-plain"
          type="button"
          unstyled
        >
          <div className="gv-sidebar-avatar">{initials}</div>
          <div className="gv-sidebar-user">
            <span className="gv-sidebar-username">{displayName}</span>
            <span className="gv-sidebar-status">online</span>
          </div>
        </Button>
      </div>
    </aside>
    </>
  );
}
