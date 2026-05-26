import React, { useState } from "react";
import { APPS } from "../constants/apps";
import { AssetIcon } from "./AssetIcon";

const GITHUB_APP = {
  id: "github",
  name: "View Source by GitHub",
  isLink: true,
  url: "https://github.com/gaminghackintosh/hackintosh.web",
  iconPath: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
};

export default function Dock({ onOpen, openApps }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const dockItems = [...APPS, GITHUB_APP];

  const getScale = (i) => {
    if (hoverIdx === null) return 1;
    const d = Math.abs(i - hoverIdx);
    if (d === 0) return 1.65;
    if (d === 1) return 1.3;
    if (d === 2) return 1.1;
    return 1;
  };

  const getTranslate = (i) => {
    if (hoverIdx === null) return 0;
    const d = Math.abs(i - hoverIdx);
    if (d === 0) return -10;
    if (d === 1) return -6;
    if (d === 2) return -2;
    return 0;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(40px) saturate(2)",
        padding: "8px 14px 12px",
        borderRadius: 22,
        boxShadow: "0 10px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.28)",
        zIndex: 9000
      }}
    >
      {dockItems.map((app, i) => {
        const scale = getScale(i);
        const ty = getTranslate(i);
        const isOpen = openApps.includes(app.id);

        return (
          <React.Fragment key={app.id}>
            {app.id === "github" && (
              <div
                aria-hidden="true"
                style={{
                  width: 1.5, 
                  height: 40, 
                  backgroundColor: "rgba(255, 255, 255, 0.25)", 
                  boxShadow: "1px 0 0 rgba(0, 0, 0, 0.15)",
                  borderRadius: 2,
                  margin: "0 4px",
                  alignSelf: "center", 
                  transform: "translateY(-4px)" 
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                transform: `scale(${scale}) translateY(${ty}px)`,
                transformOrigin: "bottom center",
                transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => {
                if (app.isLink) {
                  window.open(app.url, "_blank", "noopener,noreferrer");
                } else {
                  onOpen(app.id);
                }
              }}
            >
              {hoverIdx === i && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(24,24,28,0.92)",
                    backdropFilter: "blur(12px)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                >
                  {app.name}
                </div>
              )}

              {app.id === "safari" || app.id === "github" ? (
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  {app.id === "github" ? (
                    <img 
                      src={app.icon} 
                      alt={app.name} 
                      style={{ width: 44, height: 44, objectFit: "contain" }} 
                    />
                  ) : (
                    <AssetIcon
                      path={app.iconPath}
                      fallback={app.icon}
                      size={48}
                      alt={app.name}
                      imgStyle={{ borderRadius: 12, objectFit: "cover" }}
                    />
                  )}
                </div>
              ) : (
                <AssetIcon
                  path={app.iconPath}
                  fallback={app.icon}
                  size={58}
                  alt={app.name}
                  style={{ borderRadius: 14, overflow: "hidden" }}
                  imgStyle={{ borderRadius: 14, objectFit: "cover" }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                {isOpen && !app.isLink && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
                    }}
                  />
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}