import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { JourneyContent } from "@/presentation/pages/Profile/components/Journey/JourneyContent";

const currentYear = new Date().getFullYear();

export function ProfileTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <TabView
      className="gv-profile-tabview"
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index ?? 0)}
    >
      <TabPanel header={`JORNADA ${currentYear}`} className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          <JourneyContent year={currentYear} />
        </div>
      </TabPanel>
      <TabPanel header="DASHBOARD" className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          <div className="gv-under-construction" aria-label="Página em construção">
            <span className="gv-under-construction-icon" aria-hidden>🔧</span>
            <h3 className="gv-under-construction-title">Página em construção</h3>
            <p className="gv-under-construction-text">Em breve você terá acesso ao dashboard.</p>
          </div>
        </div>
      </TabPanel>
      <TabPanel header="AMIGOS" className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          <div className="gv-under-construction" aria-label="Página em construção">
            <span className="gv-under-construction-icon" aria-hidden>🔧</span>
            <h3 className="gv-under-construction-title">Página em construção</h3>
            <p className="gv-under-construction-text">Em breve você poderá ver e gerenciar seus amigos aqui.</p>
          </div>
        </div>
      </TabPanel>
    </TabView>
  );
}
