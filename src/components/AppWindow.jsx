import React, { useRef, useState } from "react";

export default function AppWindow({
  win,
  onClose,
  onMinimize,
  onFocus,
  isActive,
  children,
}) {
  const [pos, setPos] = useState({
    x: win.x,
    y: win.y,
  });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  return (
    <div>
      {/* JSX окна */}
    </div>
  );
}