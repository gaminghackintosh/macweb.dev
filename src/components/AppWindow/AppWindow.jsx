import React, { useState, useRef, useLayoutEffect, memo, useMemo, useCallback } from "react";

// Мемоизированное значение контекста по умолчанию
const defaultWindowContextValue = {
  onClose: () => {},
  onMinimize: () => {},
  onZoom: () => {},
  onFocus: () => {},
  onTitleMouseDown: () => {},
};

export const WindowContext = React.createContext(defaultWindowContextValue);

export const AppWindow = memo(function AppWindow({
  win,
  onClose,
  onMinimize,
  onFocus,
  isActive,
  isMinimized = false,
  children,
  onZoom = null,
}) {
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [size, setSize] = useState({ width: win.width, height: win.height });

  // Refs для производительности
  const windowRef = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const resizeEdge = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ w: 0, h: 0 });

  const [cursor, setCursor] = useState("default");
  const [hoverEdge, setHoverEdge] = useState(null);
  const [animating, setAnimating] = useState(false);

  const RESIZE_EDGE_SIZE = 10;
  const TITLE_BAR_HEIGHT = 0;

  // === Синхронизация с пропсами (только при максимизации/восстановлении) ===
  useLayoutEffect(() => {
    // Если уже анимируем – пропускаем, чтобы не перебивать анимацию
    if (animating) return;

    const targetX = win.x;
    const targetY = win.y;
    const targetW = win.width;
    const targetH = win.height;

    // Запускаем анимацию только если координаты действительно изменились
    if (
      pos.x !== targetX ||
      pos.y !== targetY ||
      size.width !== targetW ||
      size.height !== targetH
    ) {
      setAnimating(true);
      requestAnimationFrame(() => {
        setPos({ x: targetX, y: targetY });
        setSize({ width: targetW, height: targetH });
      });
    }
  }, [win.x, win.y, win.width, win.height]); // eslint-disable-line react-hooks/exhaustive-deps

  // === Применение позиции и размера к DOM ===
  useLayoutEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      windowRef.current.style.width = `${size.width}px`;
      windowRef.current.style.height = `${size.height}px`;
    }
  }, [pos, size]);

  // Определение края для ресайза
  const getResizeEdge = (e) => {
    if (!windowRef.current) return null;
    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edges = [];
    if (y < RESIZE_EDGE_SIZE) edges.push("top");
    if (y > rect.height - RESIZE_EDGE_SIZE) edges.push("bottom");
    if (x < RESIZE_EDGE_SIZE) edges.push("left");
    if (x > rect.width - RESIZE_EDGE_SIZE) edges.push("right");
    return edges.length > 0 ? edges.join("-") : null;
  };

  const getCursorStyle = (edge) => {
    if (!edge) return "default";
    const cursorMap = {
      top: "ns-resize",
      bottom: "ns-resize",
      left: "ew-resize",
      right: "ew-resize",
      "top-left": "nwse-resize",
      "top-right": "nesw-resize",
      "bottom-left": "nesw-resize",
      "bottom-right": "nwse-resize",
    };
    return cursorMap[edge] || "default";
  };

  // ─── Mouse events ────────────────────────────────────────────────

  const onWindowMouseMove = (e) => {
    const edge = getResizeEdge(e);
    setCursor(getCursorStyle(edge));
    setHoverEdge(edge);
  };

  const onWindowMouseDown = (e) => {
    const edge = getResizeEdge(e);
    if (edge) {
      e.preventDefault();
      onFocus();
      resizing.current = true;
      resizeEdge.current = edge;
      offset.current = { x: e.clientX, y: e.clientY };
      initialPos.current = { x: pos.x, y: pos.y };
      initialSize.current = { w: size.width, h: size.height };

      const onMove = (ev) => {
        if (!resizing.current) return;
        const dx = ev.clientX - offset.current.x;
        const dy = ev.clientY - offset.current.y;
        const minWidth = 300;
        const minHeight = 200;
        let newWidth = initialSize.current.w;
        let newHeight = initialSize.current.h;
        let newX = initialPos.current.x;
        let newY = initialPos.current.y;

        if (resizeEdge.current.includes("right")) {
          newWidth = Math.max(minWidth, initialSize.current.w + dx);
        }
        if (resizeEdge.current.includes("left")) {
          const w = Math.max(minWidth, initialSize.current.w - dx);
          if (w >= minWidth) {
            newWidth = w;
            newX = initialPos.current.x + dx;
          }
        }
        if (resizeEdge.current.includes("bottom")) {
          newHeight = Math.max(minHeight, initialSize.current.h + dy);
        }
        if (resizeEdge.current.includes("top")) {
          const h = Math.max(minHeight, initialSize.current.h - dy);
          if (h >= minHeight) {
            newHeight = h;
            newY = initialPos.current.y + dy;
          }
        }

        if (windowRef.current) {
          windowRef.current.style.width = `${newWidth}px`;
          windowRef.current.style.height = `${newHeight}px`;
          windowRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      };

      const onUp = () => {
        resizing.current = false;
        resizeEdge.current = null;
        if (windowRef.current) {
          const rect = windowRef.current.getBoundingClientRect();
          setPos({ x: rect.left, y: rect.top });
          setSize({ width: rect.width, height: rect.height });
        }
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
  };

  const onTitleMouseDown = (e) => {
    if (e.button !== 0 || getResizeEdge(e)) return;
    onFocus();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (ev) => {
      if (!dragging.current) return;
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, ev.clientX - offset.current.x));
      const newY = Math.max(0, ev.clientY - offset.current.y);

      if (windowRef.current) {
        windowRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    };

    const onUp = () => {
      dragging.current = false;
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        setPos({ x: rect.left, y: rect.top });
      }
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  };

  // Мемоизированное значение контекста
  const contextValue = useMemo(() => ({
    onClose,
    onMinimize,
    onZoom,
    onFocus,
    onTitleMouseDown,
  }), [onClose, onMinimize, onZoom, onFocus, onTitleMouseDown]);

  return (
    <WindowContext.Provider value={contextValue}>
      <div
        ref={windowRef}
        className={[
          "app-window",
          isActive ? "app-window--active" : "app-window--inactive",
          hoverEdge ? "app-window--resizing" : "",
          isMinimized ? "app-window--minimized" : "",
          animating ? "app-window--animating" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseDown={onWindowMouseDown}
        onMouseMove={onWindowMouseMove}
        onMouseLeave={() => setCursor("default")}
        onContextMenu={(e) => e.stopPropagation()}
        onTransitionEnd={() => {
          setAnimating(false);
        }}
        style={{
          position: "fixed",
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: size.width,
          height: size.height,
          zIndex: win.zIndex,
          cursor,
          willChange: animating || hoverEdge ? "transform, width, height" : "auto",
        }}
      >
        <div className="app-window__content">{children}</div>

        <div className="resize-handle">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M14 0 L14 14 L0 14" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
            <path d="M10 14 L14 10" stroke="white" strokeWidth="1" opacity="0.6" />
            <path d="M6 14 L14 6" stroke="white" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      </div>
    </WindowContext.Provider>
  );
});