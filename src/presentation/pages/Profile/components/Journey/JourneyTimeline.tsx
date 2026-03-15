import { useState } from "react";
import type { JourneyMonth } from "./types";
import type { JourneyGame } from "./types";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { JourneyGameCard } from "@/presentation/pages/Profile/components/Journey/JourneyGameCard";
import "../../styles/Journey.css";

const ZERADOS_STATUS: JourneyGame["status"][] = ["COMPLETED", "PLATINUM"];

function isZerado(game: JourneyGame) {
  return ZERADOS_STATUS.includes(game.status);
}

interface JourneyTimelineProps {
  months: JourneyMonth[];
}

function TimelineGameSlot({
  game,
  badge,
}: {
  game: JourneyGame;
  badge?: "zerado" | "playing";
}) {
  const isPlaying = badge === "playing";
  return (
    <div
      key={game.id}
      className={`gv-journey-timeline-game-slot ${isPlaying ? "gv-journey-timeline-game-slot--playing" : ""}`}
    >
      <div className="gv-journey-timeline-cover-wrap">
        <img
          src={game.coverImageUrl}
          alt=""
          className="gv-journey-timeline-cover"
        />
        {isPlaying ? (
          <span className="gv-journey-badge-playing">Jogando agora</span>
        ) : (
          <>
            {game.is100Percent && (
              <span className="gv-journey-badge-100">100%</span>
            )}
            {game.status === "PLATINUM" && (
              <span className="gv-journey-badge-platina">Platina</span>
            )}
          </>
        )}
      </div>
      <JourneyGameCard game={game} compact />
    </div>
  );
}

export function JourneyTimeline({ months }: JourneyTimelineProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const jogosZerados: JourneyGame[] = [];
  const jogandoAgora: JourneyGame[] = [];

  months.forEach((month) => {
    month.games.forEach((game) => {
      if (isZerado(game)) jogosZerados.push(game);
      else if (game.status === "PLAYING") jogandoAgora.push(game);
    });
  });

  return (
    <section className="gv-journey-timeline-wrap" aria-label="Linha do tempo">
      <Card
        className="gv-journey-timeline-card"
        pt={{
          root: { className: "gv-journey-timeline-card" },
          body: { style: { padding: 0 } },
          content: { style: { padding: 0 } },
        }}
      >
        <TabView
          className="gv-journey-timeline-tabs"
          activeIndex={activeTabIndex}
          onTabChange={(e) => setActiveTabIndex(e.index)}
        >
          <TabPanel
            header={
              <>
                <i className="pi pi-calendar gv-journey-tab-icon" />
                <span>Linha do Tempo</span>
              </>
            }
            className="gv-journey-timeline-tab-panel"
          >
            <div className="gv-journey-timeline-block">
              <div className="gv-journey-timeline-scroll">
                <div className="gv-journey-timeline-track">
                  {jogosZerados.length > 0 ? (
                    jogosZerados.map((game) => (
                      <TimelineGameSlot
                        key={game.id}
                        game={game}
                        badge="zerado"
                      />
                    ))
                  ) : (
                    <Message
                      severity="info"
                      className="gv-journey-timeline-empty"
                      text="Nenhum jogo zerado neste ano ainda."
                      icon="pi pi-inbox"
                    />
                  )}
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            header={
              <>
                <i className="pi pi-play gv-journey-tab-icon" />
                <span>Jogando agora</span>
              </>
            }
            className="gv-journey-timeline-tab-panel"
          >
            <div className="gv-journey-timeline-block">
              <div className="gv-journey-timeline-scroll">
                <div className="gv-journey-timeline-track">
                  {jogandoAgora.length > 0 ? (
                    jogandoAgora.map((game) => (
                      <TimelineGameSlot
                        key={game.id}
                        game={game}
                        badge="playing"
                      />
                    ))
                  ) : (
                    <Message
                      severity="info"
                      className="gv-journey-timeline-empty"
                      text="Nenhum jogo em andamento."
                      icon="pi pi-play-circle"
                    />
                  )}
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            header={
              <>
                <i className="pi pi-trash gv-journey-tab-icon" />
                <span>Jogos Trocados</span>
              </>
            }
            className="gv-journey-timeline-tab-panel"
          >
            <div className="gv-journey-timeline-block">
              <Message
                severity="info"
                className="gv-journey-timeline-empty"
                text="Nenhum jogo trocado ainda. Troque jogos com amigos pela rede!"
                icon="pi pi-exchange"
              />
            </div>
          </TabPanel>
        </TabView>
      </Card>
    </section>
  );
}
