import React, { memo } from "react";
import { WALLPAPER_GROUPS } from "@/core/constants/wallpapers";
import { SettingsPanel } from "@/features/settings/Settings_Components/SettingsPanel";

export const WallpaperPanel = memo(function WallpaperPanel({ currentWallpaper, onWallpaperChange }) {
  return (
    <SettingsPanel title="Wallpaper" description="Choose a background image for your desktop">
      {WALLPAPER_GROUPS.map((group) => (
        <div key={group.id} className="wallpaper-group">
          <h3 className="wallpaper-group-title">{group.title}</h3>
          <div className="wallpaper-grid">
            {group.wallpapers.map((wp) => {
              const isSelected = currentWallpaper === wp.id;
              return (
                <div
                  key={wp.id}
                  className={`wallpaper-card${isSelected ? " selected" : ""}`}
                  onClick={() => onWallpaperChange?.({ id: wp.id, type: "image", value: wp.image })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onWallpaperChange?.({ id: wp.id, type: "image", value: wp.image });
                    }
                  }}
                >
                  <div className="wallpaper-thumbnail">
                    <img src={wp.thumbnail} alt={wp.name} loading="lazy" decoding="async" />
                    {isSelected && <div className="check-badge">✓</div>}
                  </div>
                  <span className="wallpaper-title">{wp.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </SettingsPanel>
  );
});
