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
  onGameClick: (game: JourneyGame, readOnly?: boolean) => void;
}

export function TimelineTabContent({
  games,
  badge,
  emptyMessage,
  emptyIcon = "pi-inbox",
  onGameClick,
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
