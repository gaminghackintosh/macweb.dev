import React, { useState } from "react";
import { APPS } from "./../constants/apps";
import { AssetIcon } from "./AssetIcon";

// Trash assets
import Trash_Empty from "./../assets/icons/desktop/Dark_Themes/Trash_Empty.png";
import Trash_Full from "./../assets/icons/desktop/Dark_Themes/Trash_Full.png";

const GITHUB_APP = {
  id: "github",
  name: "View Source by GitHub",
  isLink: true,
  url: "https://github.com/gaminghackintosh/hackintosh.web",
  icon:
    "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
};

export default function Dock({
  onOpen,
  openApps,
  isTrashFull = false,
}) {
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
    <div className="dock">
      {dockItems.map((app, i) => {
        const scale = getScale(i);
        const ty = getTranslate(i);

        const isOpen = openApps?.includes(app.id);
        const isGitHub = app.id === "github";
        const isTrash = app.id === "trash";

        const currentIconPath = isTrash
          ? isTrashFull
            ? Trash_Full
            : Trash_Empty
          : app.iconPath;

        return (
          <React.Fragment key={app.id}>
            {isGitHub && (
              <div className="dock__separator" aria-hidden="true" />
            )}

            <div
              className="dock__item"
              style={{
                transform: `scale(${scale}) translateY(${ty}px)`,
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
                <div className="dock__tooltip">{app.name}</div>
              )}

              {isGitHub ? (
                <div className="dock__icon-wrapper dock__icon-wrapper--white-bg">
                  <img src={app.icon} alt={app.name} />
                </div>
              ) : (
                <AssetIcon
                  path={currentIconPath}
                  fallback={app.icon}
                  size={58}
                  alt={app.name}
                />
              )}

              <div className="dock__indicator">
                {isOpen && !app.isLink && (
                  <div className="dock__indicator-dot" />
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}