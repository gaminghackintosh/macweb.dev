import React, { useState, useCallback, useRef, useEffect, memo, forwardRef, useMemo } from "react";
import { APPS } from "@/core/constants/apps";
import { AssetIcon } from "@/ui";

const GITHUB_APP = {
  id: "github",
  name: "View Source by GitHub",
  isLink: true,
  url: "https://github.com/gaminghackintosh/macweb.dev",
  icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
};

const BASE_ICON_SIZE = 58;

// ─── MAGNIFICATION TUNING (как у настоящего Dock) ─────────────────────────
const MAX_SCALE = 1.1;
const SIGMA = 62;  
const LIFT = 22;        

const DOCK_APPS = [
  APPS.find(a => a.id === "finder"),
  APPS.find(a => a.id === "safari"),
  APPS.find(a => a.id === "calendar"),
  APPS.find(a => a.id === "music"),
  { type: "divider" },
  APPS.find(a => a.id === "notes"),
  APPS.find(a => a.id === "calculator"),
  APPS.find(a => a.id === "terminal"),
  APPS.find(a => a.id === "settings"),
];

const FILTERED_DOCK_APPS = DOCK_APPS.filter(app => app && app.id !== undefined);


function useDockMagnification(containerRef) {
  const itemsRef = useRef([]);
  const centersRef = useRef([]);
  const mouseXRef = useRef(null);
  const rafRef = useRef(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    centersRef.current = itemsRef.current.map((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return (r.left + r.right) / 2 - containerRect.left;
    });
  }, [containerRef]);

  const apply = useCallback(() => {
    rafRef.current = null;
    const mouseX = mouseXRef.current;

    itemsRef.current.forEach((el, i) => {
      if (!el) return;

      if (mouseX == null) {
        el.style.transform = "";
        el.style.zIndex = "";
        return;
      }

      const center = centersRef.current[i] ?? 0;
      const d = mouseX - center;
      const scale = 1 + (MAX_SCALE - 1) * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
      const lift = (LIFT * (scale - 1)) / (MAX_SCALE - 1);

      el.style.transform = `translateZ(0) scale(${scale.toFixed(3)}) translateY(${-lift.toFixed(2)}px)`;
      el.style.zIndex = scale > 1.015 ? "50" : "";
    });
  }, []);

  const scheduleApply = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(apply);
  }, [apply]);

  const onMouseEnter = useCallback(() => {
    measure();
    containerRef.current?.classList.add("dock--interacting");
  }, [measure, containerRef]);

  const onMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseXRef.current = e.clientX - rect.left;
    scheduleApply();
  }, [containerRef, scheduleApply]);

  const onMouseLeave = useCallback(() => {
    mouseXRef.current = null;
    scheduleApply();
    containerRef.current?.classList.remove("dock--interacting");
  }, [containerRef, scheduleApply]);

  // Регистрация ref конкретной иконки по индексу
  const registerItem = useCallback((index) => (el) => {
    itemsRef.current[index] = el;
  }, []);

  // Очистка rAF при размонтировании
  useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  }, []);

  return { onMouseEnter, onMouseMove, onMouseLeave, registerItem };
}

// ─── КОМПОНЕНТ ОТДЕЛЬНОГО ЭЛЕМЕНТА С ТУЛТИПОМ ──────────────────────────────
const DockItem = memo(forwardRef(function DockItem({
  app,
  onOpen,
  isOpen,
  isMinimized,
  isLightTheme
}, ref) {
  const [isHovered, setIsHovered] = useState(false);
  const isGitHub = app.id === "github";

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleClick = useCallback(() => {
    if (app.isLink) {
      window.open(app.url, "_blank");
    } else {
      onOpen(app.id);
    }
  }, [app.isLink, app.url, app.id, onOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div
      className={`dock__item-wrapper ${isHovered ? "dock__item-wrapper--hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="dock__tooltip" role="tooltip">
        {app.name}
      </div>

      {/* Иконка — transform во время магнификации пишется напрямую в DOM */}
      <div
        ref={ref}
        className="dock__item"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={`Launch ${app.name} app`}
        tabIndex={0}
        style={{ contain: "layout style" }}
      >
        {isGitHub ? (
          <div className="dock__icon-wrapper dock__icon-wrapper--white-bg">
            <img
              src={app.icon}
              alt={app.name}
              draggable={false}
              loading="lazy"
              decoding="async"
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

        {/* Индикатор (открыто / свернуто) */}
        <div className="dock__indicator">
          {isOpen && !app.isLink && (
            <div
              className={`dock__indicator-dot ${isMinimized ? "dock__indicator-dot--minimized" : ""}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}));

const DockSeparator = memo(() => <div className="dock__separator" aria-hidden="true" />);

// ─── ОСНОВНОЙ КОМПОНЕНТ DOCK ──────────────────────────────────────────────
export default function Dock({ onOpen, openApps, minimizedApps = new Set(), isLightTheme = false }) {
  const mainDockRef = useRef(null);
  const githubDockRef = useRef(null);

  const mainMag = useDockMagnification(mainDockRef);
  const githubMag = useDockMagnification(githubDockRef);

  // Мемоизация списка элементов (с привязкой к индексу для refs магнификации)
  // ✅ Убрали mainMag из зависимостей — функции в mainMag стабильны
  const dockItems = useMemo(() => {
    let items = [];
    let itemIndex = 0;

    FILTERED_DOCK_APPS.forEach((app, idx) => {
      if (app.type === "divider") {
        items.push(<DockSeparator key={`sep-${idx}`} />);
        return;
      }
      if (!app.id) return;

      const isOpen = openApps?.includes(app.id);
      const isMinimized = minimizedApps instanceof Set ? minimizedApps.has(app.id) : minimizedApps?.includes?.(app.id);

      const currentIndex = itemIndex++;

      items.push(
        <DockItem
          key={app.id}
          ref={mainMag.registerItem(currentIndex)}
          app={app}
          onOpen={onOpen}
          isOpen={isOpen}
          isMinimized={isMinimized}
          isLightTheme={isLightTheme}
        />
      );
    });
    return items;
  }, [openApps, minimizedApps, onOpen, isLightTheme, mainMag.registerItem]);

  return (
    <div className="dock-container">
      <div
        className="dock"
        ref={mainDockRef}
        onMouseEnter={mainMag.onMouseEnter}
        onMouseMove={mainMag.onMouseMove}
        onMouseLeave={mainMag.onMouseLeave}
      >
        {dockItems}
      </div>

      {/* Отдельный Dock для GitHub */}
      <div
        className="dock dock--github"
        ref={githubDockRef}
        onMouseEnter={githubMag.onMouseEnter}
        onMouseMove={githubMag.onMouseMove}
        onMouseLeave={githubMag.onMouseLeave}
      >
        <DockItem
          ref={githubMag.registerItem(0)}
          app={GITHUB_APP}
          onOpen={onOpen}
          isOpen={false}
          isMinimized={false}
          isLightTheme={isLightTheme}
        />
      </div>
    </div>
  );
}