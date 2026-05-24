import React, { useState, useEffect, useRef } from "react";
import AppleIcon from "../../AppleIcon";

/* ===== ASSETS ===== */
import batteryIcon from "../../../assets/icons/menuBar/battery_charge.png";
import wifiIcon from "../../../assets/icons/menuBar/wi-fi.png";

/* ===== MENU BAR ===== */
export function MenuBar({ activeApp }) {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null);
  const barRef = useRef(null);

  const menuOptions = {
    File: ["New Folder", "New Window", "Open...", "Close Window"],
    Edit: ["Undo", "Redo", "Cut", "Copy", "Paste", "Select All"],
    View: ["Show Sidebar", "Show Path Bar", "Sort By", "Clean Up"],
    Window: ["Minimize", "Zoom", "Bring All to Front"],
    Help: ["Search", "About This Mac"],
  };

  const leftItems = [" ", activeApp || "Finder", "File", "Edit", "View", "Window", "Help"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeMenu) return;

    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  const fmtTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const fmtDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div ref={barRef} className="menuBar">
      <div className="menuBar__left">
        {leftItems.map((item, i) => {
          const isClickable = i > 1;

          return (
            <div key={i} className="menuBar__itemWrapper">
              <span
                className={[
                  "menuBar__item",
                  isClickable ? "isClickable" : "",
                  activeMenu === item ? "isActive" : "",
                  i === 0 ? "isApple" : "",
                  i <= 1 ? "isBold" : "",
                ].join(" ")}
                onClick={() => {
                  if (!isClickable) return;
                  setActiveMenu(activeMenu === item ? null : item);
                }}
              >
                {item === " " ? <AppleIcon /> : item}
              </span>

              {activeMenu === item && menuOptions[item] && (
                <div className="menuBar__dropdown">
                  {menuOptions[item].map((option, idx) => (
                    <div
                      key={idx}
                      className="menuBar__dropdownItem"
                      onClick={() => setActiveMenu(null)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="menuBar__right">
        <img
          src={batteryIcon}
          alt="Battery"
          className="menuBar__iconImg"
        />

        <img
          src={wifiIcon}
          alt="Wifi"
          className="menuBar__iconImg"
        />
        <span className="menuBar__date">{fmtDate(time)}</span>
        <span className="menuBar__time">{fmtTime(time)}</span>
      </div>
    </div>
  );
}