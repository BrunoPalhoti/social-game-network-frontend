import { Outlet } from "react-router-dom";
import { Header } from "@/presentation/components/Header";
import { Sidebar } from "@/presentation/components/Sidebar/Sidebar";
import "./Layout.css";

export function Layout() {
  return (
    <div className="gv-layout">
      <Sidebar />
      <main className="gv-layout-main">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
