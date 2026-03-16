import { Outlet } from "react-router-dom";
import { Button } from "primereact/button";
import "./styles/Layout.css";

export function Layout() {
  return (
    <div className="gv-layout">
      <main className="gv-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
