import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "primereact/button";
import { Sidebar } from "@/presentation/components/Sidebar/Sidebar";
import "./styles/Layout.css";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="gv-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Button
        icon="pi pi-bars"
        rounded
        text
        severity="secondary"
        aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        className="gv-layout-menu-toggle"
        onClick={toggleSidebar}
        title={sidebarOpen ? "Fechar menu" : "Abrir menu"}
      />
      <main className="gv-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
