import React, { useState, useRef, useCallback, memo } from "react";
import { APPS } from "./../constants/apps";
import { AssetIcon } from "./AssetIcon";

const GITHUB_APP = {
  id: "github",
  name: "View Source by GitHub",
  isLink: true,
  url: "https://github.com/gaminghackintosh/hackintosh.web",
  icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
};

// Базовый размер иконки в Dock
const BASE_ICON_SIZE = 58;

const DockItem = memo(function DockItem({ 
  app, 
  isHovered,
  onOpen, 
  isOpen, 
  isMinimized,
  isLightTheme
}) {
  const itemRef = useRef(null);
  const isGitHub = app.id === "github";
  
  const handleClick = useCallback(() => {
    if (app.isLink) {
      window.open(app.url, "_blank");
    } else {
      onOpen(app.id);
    }
  }, [app, onOpen]);
  
  return (
    <div
      ref={itemRef}
      className={`dock__item ${isHovered ? "dock__item--hovered" : ""}`}
      onClick={handleClick}
      role="button"
      aria-label={`Launch ${app.name} app`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Icon */}
      {isGitHub ? (
        <div className="dock__icon-wrapper dock__icon-wrapper--white-bg">
          <img 
            src={app.icon} 
            alt={app.name}
            draggable={false}
            style={{ width: `${BASE_ICON_SIZE}px`, height: `${BASE_ICON_SIZE}px` }}
          />
        </div>
      ) : (
        <AssetIcon 
          path={app.iconPath} 
          pathLight={app.iconPathLight}
          fallback={app.icon} 
          size={BASE_ICON_SIZE} 
          alt={app.name}
          isLightTheme={isLightTheme}
          imgStyle={{ width: `${BASE_ICON_SIZE}px`, height: `${BASE_ICON_SIZE}px` }}
        />
      )}

      {/* Indicator dot */}
      <div className="dock__indicator">
        {isOpen && !app.isLink && (
          <div 
            className={`dock__indicator-dot ${isMinimized ? "dock__indicator-dot--minimized" : ""}`}
          />
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Кастомная проверка для минимизации ререндеров
  return (
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.isMinimized === nextProps.isMinimized &&
    prevProps.isLightTheme === nextProps.isLightTheme &&
    prevProps.app.id === nextProps.app.id
  );
});

export default function Dock({ onOpen, openApps, minimizedApps = new Set(), isLightTheme = false }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const dockItems = [...APPS, GITHUB_APP];
  const dockRef = useRef(null);

  return (
    <div 
      ref={dockRef}
      className="dock"
      onMouseLeave={() => setHoverIndex(null)}
    >
      {dockItems.map((app, index) => {
        const isGitHub = app.id === "github";
        const isOpen = openApps?.includes(app.id);
        const isMinimized = minimizedApps?.has(app.id);
        
        return (
          <React.Fragment key={app.id}>
            {isGitHub && <div className="dock__separator" aria-hidden="true" />}
            <div
              className="dock__item-wrapper"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Tooltip - moved to wrapper for stable positioning */}
              <div 
                className={`dock__tooltip ${hoverIndex === index ? "dock__tooltip--visible" : ""}`}
              >
                {app.name}
              </div>
              
              <DockItem
                app={app}
                isHovered={hoverIndex === index}
                onOpen={onOpen}
                isOpen={isOpen}
                isMinimized={isMinimized}
                isLightTheme={isLightTheme}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}