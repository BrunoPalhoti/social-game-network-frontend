import { useState } from "react";

const currentYear = new Date().getFullYear();

export function useProfileTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return {
    currentYear,
    activeIndex,
    setActiveIndex,
  };
}

