import React, { useState, useContext, useMemo, useCallback, memo } from "react";
import { WindowContext } from "@/windows";
import { MENU_SECTIONS, PANELS } from "./SettingsContent/constants.jsx";
import { SettingsSidebar } from "./SettingsContent/components";
import { AboutPanel } from "./SettingsContent/panels/AboutPanel";
import { WallpaperPanel } from "./SettingsContent/panels/WallpaperPanel";

export const SettingsContent = memo(function SettingsContent({ currentWallpaper, onWallpaperChange }) {
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { onZoom } = useContext(WindowContext);

  const handleZoom = useCallback(() => {
    setIsExpanded(prev => !prev);
    onZoom?.();
  }, [onZoom]);

  const filteredSections = useMemo(() =>
    MENU_SECTIONS
      .map(section => ({ ...section, items: section.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())) }))
      .filter(section => section.items.length > 0),
    [searchQuery]
  );

  const handleTabClick = useCallback((id) => setActiveTab(id === "appleid" ? "about" : id), []);
  const handleWallpaperChange = useCallback((wp) => onWallpaperChange?.(wp), [onWallpaperChange]);

  const tabContent = useMemo(() => {
    if (activeTab === "wallpaper") return <WallpaperPanel currentWallpaper={currentWallpaper} onWallpaperChange={handleWallpaperChange} />;
    if (activeTab === "about" || activeTab === "appleid") return <AboutPanel />;
    const PanelComponent = PANELS[activeTab];
    return PanelComponent ? <PanelComponent /> : null;
  }, [activeTab, currentWallpaper, handleWallpaperChange]);

  return (
    <div className="settings-container">
      <SettingsSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        filteredSections={filteredSections}
      />

      <div className={`settings-content${isExpanded ? " settings-content--expanded" : ""}`} role="tabpanel">
        {tabContent}
      </div>
    </div>
  );
});
