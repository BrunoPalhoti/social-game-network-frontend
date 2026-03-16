import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import type { JourneyGame, JourneyMonth } from "../../types";
import { JourneyGameCard } from "../JourneyGameCard";
import { useJourneyTimeline } from "../../hooks/useJourneyTimeline";
import { useJourneyFormModal } from "../../hooks/useJourneyFormModal";
import { TimelineTabContent } from "../TimelineTabContent";
import { JourneyGameFormModal } from "../JourneyGameFormModal";
import { useJourneyCompletedFilters } from "./hooks/useJourneyCompletedFilters";
import "../../../../styles/Journey.css";

interface JourneyTimelineProps {
  months: JourneyMonth[];
  year: number;
  addGame: (
    game: Omit<import("../../types").JourneyGame, "monthKey"> & { startedAt: string }
  ) => void;
  updateGame: (gameId: string, updates: Partial<import("../../types").JourneyGame>) => void;
  clearAll: () => void;
  jogosZeradosAno?: JourneyGame[];
}

const TAB_CONFIG = [
  {
    key: "zerados" as const,
    header: (
      <>
        <i className="pi pi-check-circle gv-journey-tab-icon" />
        <span>Jogos Zerados</span>
      </>
    ),
    badge: "zerado" as const,
    emptyMessage: "Nenhum jogo zerado neste ano ainda.",
    emptyIcon: "pi-inbox",
    showAddButton: false,
  },
  {
    key: "playing" as const,
    header: (
      <>
        <i className="pi pi-play gv-journey-tab-icon" />
        <span>Jogando agora</span>
      </>
    ),
    badge: "playing" as const,
    emptyMessage: "Nenhum jogo em andamento.",
    emptyIcon: "pi-play-circle",
    showAddButton: true,
  },
  {
    key: "dropped" as const,
    header: (
      <>
        <i className="pi pi-trash gv-journey-tab-icon" />
        <span>Jogos DROPADOS</span>
      </>
    ),
    badge: "dropped" as const,
    emptyMessage: "Nenhum jogo dropado ainda.",
    emptyIcon: "pi-trash",
    showAddButton: false,
  },
] as const;

export function JourneyTimeline({
  months,
  year,
  addGame,
  updateGame,
  clearAll: _clearAll,
  jogosZeradosAno,
}: JourneyTimelineProps) {
  const { activeTabIndex, setActiveTabIndex, jogosZerados, jogandoAgora, jogosDropados } =
    useJourneyTimeline(months);

  const {
    modalVisible,
    selectedGame,
    modalReadOnly,
    openModal,
    closeModal,
    handleSave,
  } = useJourneyFormModal({
    addGame,
    updateGame,
    setActiveTabIndex,
  });

  const completedGames = jogosZeradosAno ?? jogosZerados;
  const {
    allCompletedVisible,
    setAllCompletedVisible,
    selectedPlatform,
    setSelectedPlatform,
    selectedGenre,
    setSelectedGenre,
    platformOptions,
    genreOptions,
    filteredCompleted,
  } = useJourneyCompletedFilters(completedGames);

  const gameLists = [jogosZerados, jogandoAgora, jogosDropados];

  return (
    <section className="gv-journey-timeline-wrap" aria-label="Jogos zerados">
      <Dialog
        header="Todos os jogos zerados"
        visible={allCompletedVisible}
        onHide={() => setAllCompletedVisible(false)}
        className="gv-journey-completed-dialog"
        style={{ width: "min(95vw, 1120px)" }}
      >
        <div className="gv-journey-completed-filters">
          <div className="gv-journey-completed-filter">
            <label className="gv-journey-completed-filter-label">Plataforma</label>
            <Dropdown
              value={selectedPlatform}
              options={platformOptions}
              onChange={(e) => setSelectedPlatform(e.value ?? null)}
              placeholder="Todas"
              showClear
              className="gv-journey-completed-dropdown"
            />
          </div>
          <div className="gv-journey-completed-filter">
            <label className="gv-journey-completed-filter-label">Gênero</label>
            <Dropdown
              value={selectedGenre}
              options={genreOptions}
              onChange={(e) => setSelectedGenre(e.value ?? null)}
              placeholder="Todos"
              showClear
              className="gv-journey-completed-dropdown"
            />
          </div>
        </div>
        <div className="gv-journey-games-grid gv-journey-games-grid--dialog">
          {filteredCompleted.map((game) => (
            <button
              key={game.id}
              type="button"
              className="gv-journey-games-dialog-item"
              onClick={() => openModal(game, true)}
            >
              <JourneyGameCard game={game} />
            </button>
          ))}
        </div>
      </Dialog>
      <JourneyGameFormModal
        key={selectedGame?.id ?? "new"}
        visible={modalVisible}
        onHide={closeModal}
        initialGame={selectedGame}
        year={year}
        onSave={handleSave}
        readOnly={modalReadOnly}
      />
      <Card
        className="gv-journey-timeline-card"
        pt={{
          root: { className: "gv-journey-timeline-card" },
          body: { style: { padding: 0 } },
          content: { style: { padding: 0 } },
        }}
      >
        <div className="gv-journey-timeline-toolbar">
          <Button
            type="button"
            label="Adicionar jogo"
            icon="pi pi-plus"
            onClick={() => openModal(null)}
            size="small"
          />
          {activeTabIndex === 0 && completedGames.length > 0 && (
            <Button
              type="button"
              label="Mostrar mais jogos zerados"
              size="small"
              outlined
              onClick={() => setAllCompletedVisible(true)}
            />
          )}
        </div>
        <TabView
          className="gv-journey-timeline-tabs"
          activeIndex={activeTabIndex}
          onTabChange={(e) => setActiveTabIndex(e.index)}
        >
          {TAB_CONFIG.map((config, index) => (
            <TabPanel
              key={config.key}
              header={config.header}
              className="gv-journey-timeline-tab-panel"
            >
              <TimelineTabContent
                games={gameLists[index] ?? []}
                badge={config.badge}
                emptyMessage={config.emptyMessage}
                emptyIcon={config.emptyIcon}
                onGameClick={openModal}
              />
            </TabPanel>
          ))}
        </TabView>
      </Card>
    </section>
  );
}
