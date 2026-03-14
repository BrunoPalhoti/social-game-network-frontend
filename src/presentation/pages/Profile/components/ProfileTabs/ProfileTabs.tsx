import { TabView, TabPanel } from "primereact/tabview";

const currentYear = new Date().getFullYear();

export function ProfileTabs() {
  return (
    <TabView className="gv-profile-tabview">
      <TabPanel header={`JORNADA ${currentYear}`} className="gv-profile-tab-panel">
        <div className="gv-profile-tab-content">
          Conteúdo da Jornada {currentYear} em breve.
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
