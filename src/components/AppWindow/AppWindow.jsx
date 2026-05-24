import React, { useState, useEffect, useRef } from "react";

/* ===== APP WINDOW ===== */
export function AppWindow({ win, onClose, onMinimize, onFocus, isActive, children }) {
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
    
    // Don't allow resize in titlebar area
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
      "top": "ns-resize",
      "bottom": "ns-resize",
      "left": "ew-resize",
      "right": "ew-resize",
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
    { color: "#ff5f57", shadow: "rgba(255,50,50,0.5)", action: onClose },
    { color: "#ffbd2e", shadow: "rgba(255,180,0,0.5)", action: onMinimize },
    { color: "#28c840", shadow: "rgba(0,200,50,0.5)", action: null },
  ];

  return (
    <div
      ref={windowRef}
      onMouseDown={onWindowMouseDown}
      onMouseMove={onWindowMouseMove}
      onMouseLeave={() => setCursor("default")}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        background: "rgba(25,25,28,0.88)",
        backdropFilter: "blur(40px) saturate(1.8)",
        border: hoverEdge ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
        transition: "border 0.15s, box-shadow 0.2s",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isActive
          ? hoverEdge
            ? "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.25)"
            : "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.1)"
          : "0 14px 40px rgba(0,0,0,0.45)",
        zIndex: win.zIndex,
        display: "flex",
        flexDirection: "column",
        cursor: cursor,
      }}
    >
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          height: 40,
          flexShrink: 0,
          background: isActive ? "rgba(48,48,52,0.9)" : "rgba(38,38,42,0.9)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          cursor: "move",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          userSelect: "none",
          transition: "background 0.2s",
        }}
      >
        <div style={{ display: "flex", gap: 7, zIndex: 1 }} onMouseDown={(e) => e.stopPropagation()}>
          {trafficLights.map((btn, i) => (
            <div
              key={i}
              onClick={btn.action || undefined}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: btn.color,
                cursor: btn.action ? "pointer" : "default",
                boxShadow: isActive ? `0 0 0 0.5px rgba(0,0,0,0.3)` : "none",
                opacity: isActive ? 1 : 0.4,
                transition: "opacity 0.2s, filter 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
            />
          ))}
        </div>

        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.35)",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            letterSpacing: 0.15,
            pointerEvents: "none",
          }}
        >
          {win.title}
        </span>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>

      <div
        style={{
          position: "absolute",
          right: 2,
          bottom: 2,
          width: 14,
          height: 14,
          opacity: 0.35,
          pointerEvents: "none",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path
            d="M14 0 L14 14 L0 14"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M10 14 L14 10"
            stroke="white"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M6 14 L14 6"
            stroke="white"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}