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
      <TabPanel header="BIBLIOTECA (143)" className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          Sua biblioteca de jogos aparecerá aqui.
        </div>
      </TabPanel>
      <TabPanel header="CONQUISTAS" className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          Suas conquistas aparecerão aqui.
        </div>
      </TabPanel>
      <TabPanel header="AMIGOS (27)" className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          Lista de amigos em breve.
        </div>
      </TabPanel>
    </TabView>
  );
}
