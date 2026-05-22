import React, { useEffect, useState } from "react";

export default function MenuBar({ activeApp }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const fmtDate = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const leftItems = [
    " ",
    activeApp || "Finder",
    "File",
    "Edit",
    "View",
    "Window",
    "Help",
  ];

  return (
    <div>
      {/* твой JSX */}
    </div>
  );
}