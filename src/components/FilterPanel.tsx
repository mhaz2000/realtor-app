// components/FilterPanel.tsx

import type { ReactNode } from "react";

const FilterPanel = ({ isActive, children }: { isActive: boolean; children: ReactNode }) => {
  if (!isActive) return null;

  return (
    <div className="transition-all duration-500 ease-in-out space-y-4">
      {children}
    </div>
  );
};

export default FilterPanel;
