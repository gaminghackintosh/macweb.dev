import React, { memo, useContext, useCallback } from "react";
import { WindowContext } from "@/windows";
import { TrafficLights } from "./TrafficLights";
import { SearchBar } from "./SearchBar";
import { AppleIdSection } from "./AppleIdSection";
import { TabsList } from "./TabsList";

export const SettingsSidebar = memo(({ 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  onTabClick,
  filteredSections 
}) => {
  const { onClose, onMinimize, onFocus, onZoom, onTitleMouseDown } = useContext(WindowContext);

  const handleZoom = useCallback(() => {
    onZoom?.();
  }, [onZoom]);

  const handleAppleIdClick = useCallback(() => {
    onTabClick("appleid");
  }, [onTabClick]);

  return (
    <div className="settings-sidebar">
      <div className="sidebar-drag-handle" onMouseDown={(e) => { if (e.target.closest('button, input')) return; onTitleMouseDown(e); }}>
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onZoom={handleZoom} />
      </div>

      <SearchBar value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />

      <AppleIdSection isActive={activeTab === "about"} onClick={handleAppleIdClick} />

      <div className="sidebar-divider" />

      <TabsList sections={filteredSections} activeTab={activeTab} onTabClick={onTabClick} />
    </div>
  );
});
