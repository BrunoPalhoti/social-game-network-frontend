import type { JourneyGame } from "../../types";
import { JourneyGameCard } from "../JourneyGameCard";
import "../../../../styles/Journey.css";

export type TimelineGameSlotBadge = "zerado" | "playing" | "dropped" | "wishlist";

interface TimelineGameSlotProps {
  game: JourneyGame;
  badge?: TimelineGameSlotBadge;
  onClick?: () => void;
}

export function TimelineGameSlot({ game, badge, onClick }: TimelineGameSlotProps) {
  const isPlaying = badge === "playing";
  const isDropped = badge === "dropped";
  const isWishlist = badge === "wishlist";
  return (
    <div
      key={game.id}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`gv-journey-timeline-game-slot ${isPlaying ? "gv-journey-timeline-game-slot--playing" : ""} ${isDropped ? "gv-journey-timeline-game-slot--dropped" : ""} ${isWishlist ? "gv-journey-timeline-game-slot--wishlist" : ""} ${onClick ? "gv-journey-timeline-game-slot--clickable" : ""}`}
    >
      <div className="gv-journey-timeline-cover-wrap">
        <img
          src={game.coverImageUrl}
          alt=""
          className="gv-journey-timeline-cover"
        />
        {isPlaying ? (
          <span className="gv-journey-badge-playing">Jogando agora</span>
        ) : isDropped ? (
          <span className="gv-journey-badge-dropped">Dropado</span>
        ) : isWishlist ? (
          <span className="gv-journey-badge-wishlist">Desejado</span>
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
