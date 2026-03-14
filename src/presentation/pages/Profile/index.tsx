import { getInitialsFromName, useAuthStore } from "@/shared/store/useAuthStore";
import { Avatar } from "primereact/avatar";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <section className="gv-profile-hero">
        <div className="gv-profile-banner" />

        <div className="gv-profile-avatar-wrap">
          <div className="gv-profile-avatar-container">
            <Avatar
              label={user ? getInitialsFromName(user.name) : "?"}
              size="xlarge"
              shape="circle"
              className="gv-profile-avatar"
            />
            <Tag
              value="PRO"
              severity="secondary"
              className="gv-profile-badge"
            />
          </div>
        </div>

        <div className="gv-profile-info">
          <p className="gv-profile-name">{user?.name ?? "..."}</p>
          <h1 className="gv-profile-username">@{user?.nickname ?? "..."}</h1>
        </div>

        <TabView className="gv-profile-tabview">
          <TabPanel header="JORNADA 2026" className="gv-profile-tab-panel">
            <div className="gv-profile-tab-content">
              Conteúdo da Jornada 2026 em breve.
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
      </section>

      <section className="gv-page-content gv-profile-content" />
    </>
  );
}
