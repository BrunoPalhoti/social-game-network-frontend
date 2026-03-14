import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "primereact/button";
import { Sidebar } from "@/presentation/components/Sidebar/Sidebar";
import "./Layout.css";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="gv-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Button
        icon="pi pi-bars"
        rounded
        text
        severity="secondary"
        aria-label="Abrir menu"
        className="gv-layout-menu-toggle"
        onClick={() => setSidebarOpen(true)}
      />
      <main className="gv-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
