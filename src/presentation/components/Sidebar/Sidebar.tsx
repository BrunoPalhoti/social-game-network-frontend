import { NavLink } from "react-router-dom";
import { GamerVerseLogo } from "../GamerVerseLogo/GamerVerseLogo";
import "./Sidebar.css";

const navItems = [
  { to: "/home", label: "Feed" },
  { to: "/comunidade", label: "Comunidade" },
  { to: "/torneios", label: "Torneios" },
  { to: "/chat", label: "Chat" },
];

export function Sidebar() {
  return (
    <aside className="gv-sidebar">
      <div className="gv-sidebar-top">
        <GamerVerseLogo asLink className="gv-sidebar-logo" showTagline={false} />

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
                ●
              </span>
              <span className="gv-sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="gv-sidebar-bottom">
        <button className="gv-sidebar-profile" type="button">
          <div className="gv-sidebar-avatar">GV</div>
          <div className="gv-sidebar-user">
            <span className="gv-sidebar-username">Game Master</span>
            <span className="gv-sidebar-status">online</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

