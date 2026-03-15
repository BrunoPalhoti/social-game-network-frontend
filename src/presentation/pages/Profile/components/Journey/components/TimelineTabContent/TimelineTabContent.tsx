import { Message } from "primereact/message";
import type { JourneyGame } from "../../types";
import type { TimelineGameSlotBadge } from "../TimelineGameSlot";
import { TimelineGameSlot } from "../TimelineGameSlot";
import "../../../../styles/Journey.css";

interface TimelineTabContentProps {
  games: JourneyGame[];
  badge: TimelineGameSlotBadge;
  emptyMessage: string;
  emptyIcon?: string;
  showAddButton?: boolean;
  onGameClick: (game: JourneyGame, readOnly?: boolean) => void;
  onAddClick?: () => void;
}

export function TimelineTabContent({
  games,
  badge,
  emptyMessage,
  emptyIcon = "pi-inbox",
  showAddButton = false,
  onGameClick,
  onAddClick,
}: TimelineTabContentProps) {
  const readOnly = badge === "zerado";
  const showEmptyMessage = games.length === 0;

  return (
    <div className="gv-journey-timeline-block">
      <div className="gv-journey-timeline-scroll">
        <div className="gv-journey-timeline-track">
          {games.map((game) => (
            <TimelineGameSlot
              key={game.id}
              game={game}
              badge={badge}
              onClick={() => onGameClick(game, readOnly)}
            />
          ))}
          {showAddButton && onAddClick && (
            <div className="gv-journey-timeline-add-slot">
              <button
                type="button"
                className="gv-journey-add-game-btn"
                onClick={onAddClick}
                aria-label="Adicionar jogo"
              >
                <i className="pi pi-plus" />
                <span>Adicionar jogo</span>
              </button>
            </div>
          )}
          {showEmptyMessage && (
            <Message
              severity="info"
              className="gv-journey-timeline-empty"
              text={emptyMessage}
              icon={`pi ${emptyIcon}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
