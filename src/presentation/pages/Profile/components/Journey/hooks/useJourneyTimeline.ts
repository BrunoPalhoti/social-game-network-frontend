import { useState, useMemo } from "react";
import type { JourneyMonth, JourneyGame } from "../types";
import { isZeradoStatus } from "../utils";

export function useJourneyTimeline(months: JourneyMonth[]) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { jogosZerados, jogandoAgora, jogosDropados } = useMemo(() => {
    const zerados: JourneyGame[] = [];
    const jogando: JourneyGame[] = [];
    const dropados: JourneyGame[] = [];
    months.forEach((month) => {
      month.games.forEach((game) => {
        if (isZeradoStatus(game.status)) zerados.push(game);
        else if (game.status === "PLAYING") jogando.push(game);
        else if (game.status === "DROPPED") dropados.push(game);
      });
    });
    return { jogosZerados: zerados, jogandoAgora: jogando, jogosDropados: dropados };
  }, [months]);

  return { activeTabIndex, setActiveTabIndex, jogosZerados, jogandoAgora, jogosDropados };
}
