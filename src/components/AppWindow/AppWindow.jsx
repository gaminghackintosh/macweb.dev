import React, { useState, useRef } from "react";

export const WindowContext = React.createContext({
  onClose: () => {},
  onMinimize: () => {},
  onFocus: () => {},
  onTitleMouseDown: () => {},
});

export function AppWindow({
  win,
  onClose,
  onMinimize,
  onFocus,
  isActive,
  children,
  titleBarHidden = false,
  onZoom = null, // Добавляем проп onZoom
}) {
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [size, setSize] = useState({ width: win.width, height: win.height });
  const dragging = useRef(false);
  const resizing = useRef(false);
  const resizeEdge = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const [cursor, setCursor] = useState("default");
  const [hoverEdge, setHoverEdge] = useState(null);

  const RESIZE_EDGE_SIZE = 10;
  const TITLE_BAR_HEIGHT = 40;

  const getResizeEdge = (e) => {
    if (!windowRef.current) return null;
    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (y < TITLE_BAR_HEIGHT) return null;
    const edges = [];
    if (y < TITLE_BAR_HEIGHT + RESIZE_EDGE_SIZE) edges.push("top");
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
      offset.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
      const onMove = (ev) => {
        if (!resizing.current) return;
        const dx = ev.clientX - offset.current.x;
        const dy = ev.clientY - offset.current.y;
        const minWidth = 300;
        const minHeight = 200;
        const newSize = { width: offset.current.w, height: offset.current.h };
        const newPos = { ...pos };
        if (resizeEdge.current.includes("right")) {
          newSize.width = Math.max(minWidth, offset.current.w + dx);
        }
        if (resizeEdge.current.includes("left")) {
          const newWidth = Math.max(minWidth, offset.current.w - dx);
          if (newWidth >= minWidth) {
            newSize.width = newWidth;
            newPos.x = pos.x + dx;
          }
        }
        if (resizeEdge.current.includes("bottom")) {
          newSize.height = Math.max(minHeight, offset.current.h + dy);
        }
        if (resizeEdge.current.includes("top")) {
          const newHeight = Math.max(minHeight, offset.current.h - dy);
          if (newHeight >= minHeight) {
            newSize.height = newHeight;
            newPos.y = pos.y + dy;
          }
        }
        setPos(newPos);
        setSize(newSize);
      };
      const onUp = () => {
        resizing.current = false;
        resizeEdge.current = null;
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
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - size.width, ev.clientX - offset.current.x)),
        y: Math.max(28, ev.clientY - offset.current.y),
      });
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  };

  const trafficLights = [
    { type: "close", action: onClose },
    { type: "minimize", action: onMinimize },
    { type: "zoom", action: onZoom },
  ];

  return (
    <WindowContext.Provider value={{ onClose, onMinimize, onFocus, onTitleMouseDown }}>
      <div
        ref={windowRef}
        className={`app-window ${isActive ? "app-window--active" : "app-window--inactive"} ${
          hoverEdge ? "app-window--resizing" : ""
        }`}
        onMouseDown={onWindowMouseDown}
        onMouseMove={onWindowMouseMove}
        onMouseLeave={() => setCursor("default")}
        style={{
          left: pos.x,
          top: pos.y,
          width: size.width,
          height: size.height,
          zIndex: win.zIndex,
          cursor: cursor,
        }}
      >

        {!titleBarHidden && (
          <div className="title-bar" onMouseDown={onTitleMouseDown}>
            <div
              className={`traffic-lights ${isActive ? "traffic-lights--active" : "traffic-lights--inactive"}`}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {trafficLights.map((btn, i) => (
                <div
                  key={i}
                  className={`traffic-light traffic-light--${btn.type}`}
                  onClick={btn.action || undefined}
                />
              ))}
            </div>
            <span
              className={`title-bar__title ${isActive ? "title-bar__title--active" : "title-bar__title--inactive"}`}
            >
              {win.title}
            </span>
          </div>
        )}

        {/* Основной контент */}
        <div className="app-window__content">{children}</div>

        {/* Иконка ресайза */}
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
}