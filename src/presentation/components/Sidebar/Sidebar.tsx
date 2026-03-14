import { NavLink } from "react-router-dom";
import { Button } from "primereact/button";
import { GamerVerseLogo } from "../GamerVerseLogo/GamerVerseLogo";
import "./Sidebar.css";

const navItems = [
  { to: "/home", label: "Feed", icon: "pi pi-home" },
  { to: "/comunidade", label: "Comunidade", icon: "pi pi-users" },
  { to: "/chat", label: "Chat", icon: "pi pi-comments" },
];

export function Sidebar() {
  return (
    <aside className="gv-sidebar">
      <div className="gv-sidebar-top">
        <GamerVerseLogo
          asLink
          className="gv-sidebar-logo"
          showTagline={false}
        />

        <nav className="gv-sidebar-nav" aria-label="Navegação principal">
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
          <div className="gv-sidebar-avatar">GV</div>
          <div className="gv-sidebar-user">
            <span className="gv-sidebar-username">Game Master</span>
            <span className="gv-sidebar-status">online</span>
          </div>
        </Button>
      </div>
    </aside>
  );
}
