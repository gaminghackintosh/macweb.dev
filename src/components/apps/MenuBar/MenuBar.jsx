import React, { useState, useEffect, useRef } from "react";
import AppleIcon from "../../AppleIcon";

/* ===== ИКОНКИ ДЛЯ CONTROL CENTER ===== */
import { FiWifi, FiMonitor, FiVolume2 } from "react-icons/fi";
import { MdOutlineBedtime, MdOutlineScreenShare } from "react-icons/md";
import { IoSwapHorizontalOutline } from "react-icons/io5";

/* ===== ASSETS ===== */
import batteryIcon from "../../../assets/icons/menuBar/battery_charge.png";
import wifiIcon from "../../../assets/icons/menuBar/wi-fi.png";
import controlCenterIcon from "../../../assets/icons/menuBar/control_center.svg";

// Компонент окна "About This Mac"
import AboutThisMac from "./AboutThisMac/ATM";

export function MenuBar({ activeApp }) {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showAboutWindow, setShowAboutWindow] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stageManagerEnabled, setStageManagerEnabled] = useState(true);
  const [screenMirroring, setScreenMirroring] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({ title: "Zemfira – земфира", isPlaying: true });

  const barRef = useRef(null);
  const controlCenterRef = useRef(null);
  const controlCenterButtonRef = useRef(null);

  const wifiName = "Kernel Panic Network";

  // Меню для Apple (яблочко) - полноценное как на скриншоте
  const appleMenuOptions = [
    { id: "about", label: "About This Mac", icon: null, badge: null, shortcut: null },
    { id: "divider1", type: "divider" },
    { id: "settings", label: "System Settings...", icon: null, badge: null, shortcut: null },
    { id: "appstore", label: "App Store...", icon: null, badge: null, shortcut: null },
    { id: "divider2", type: "divider" },
    { id: "recent", label: "Recent Items", icon: "➤", badge: null, shortcut: null, submenu: true },
    { id: "divider3", type: "divider" },
    { id: "forcequit", label: `Force Quit ${activeApp || "Finder"}`, icon: null, badge: null, shortcut: "⌥⇧⌘Q" },
    { id: "divider4", type: "divider" },
    { id: "sleep", label: "Sleep", icon: null, badge: null, shortcut: null },
    { id: "restart", label: "Restart...", icon: null, badge: null, shortcut: null },
    { id: "shutdown", label: "Shut Down...", icon: null, badge: null, shortcut: null },
    { id: "divider5", type: "divider" },
    { id: "lockscreen", label: "Lock Screen", icon: null, badge: null, shortcut: "⌃⌘Q" },
    { id: "logout", label: `Log Out ${activeApp || "gamehack..."}`, icon: null, badge: null, shortcut: "⇧⌘Q" },
  ];

  const menuOptions = {
    File: ["New Folder", "New Window", "Open...", "Close Window"],
    Edit: ["Undo", "Redo", "Cut", "Copy", "Paste", "Select All"],
    View: ["Show Sidebar", "Show Path Bar", "Sort By", "Clean Up"],
    Window: ["Minimize", "Zoom", "Bring All to Front"],
    Help: ["Search", "About This Mac"],
  };

  const leftItems = [" ", activeApp || "Finder", "File", "Edit", "View", "Window", "Help"];

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeMenu) return;
    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  useEffect(() => {
    if (!showControlCenter) return;
    const handleClickOutside = (event) => {
      if (
        controlCenterRef.current && !controlCenterRef.current.contains(event.target) &&
        controlCenterButtonRef.current && !controlCenterButtonRef.current.contains(event.target)
      ) {
        setShowControlCenter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showControlCenter]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const fmtTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  const fmtDate = (date) =>
    date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });

  const toggleControlCenter = () => setShowControlCenter(!showControlCenter);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Обработчик клика на яблочко
  const handleAppleClick = (e) => {
    e.stopPropagation();
    if (activeMenu === " ") {
      setActiveMenu(null);
    } else {
      setActiveMenu(" ");
    }
  };

  // Обработчик выбора "About This Mac"
  const handleAboutThisMac = () => {
    setActiveMenu(null);
    setShowAboutWindow(true);
  };

  // Закрытие окна About
  const closeAboutWindow = () => {
    setShowAboutWindow(false);
  };

  return (
    <>
      <div ref={barRef} className="menuBar">
        <div className="menuBar__left">
          {leftItems.map((item, i) => {
            const isClickable = i > 1 || i === 0;
            return (
              <div 
                key={i} 
                className="menuBar__itemWrapper"
              >
                <span
                  className={[
                    "menuBar__item",
                    isClickable ? "isClickable" : "",
                    activeMenu === item ? "isActive" : "",
                    i === 0 ? "isApple" : "",
                    i <= 1 ? "isBold" : "",
                  ].join(" ")}
                  onClick={(e) => { 
                    if (i === 0) {
                      handleAppleClick(e);
                    } else if (isClickable) {
                      setActiveMenu(activeMenu === item ? null : item);
                    }
                  }}
                >
                  {item === " " ? <AppleIcon /> : item}
                </span>
                
                {/* Apple Menu - полноценное меню */}
                {activeMenu === " " && i === 0 && (
                  <div className="menuBar__dropdown apple-menu">
                    {appleMenuOptions.map((option, idx) => {
                      if (option.type === "divider") {
                        return <div key={idx} className="menuBar__dropdownDivider" />;
                      }
                      
                      return (
                        <div 
                          key={idx} 
                          className="menuBar__dropdownItem" 
                          onClick={() => {
                            if (option.id === "about") {
                              handleAboutThisMac();
                            } else {
                              setActiveMenu(null);
                            }
                          }}
                        >
                          <span className="menuBar__dropdownLabel">{option.label}</span>
                          {option.badge && (
                            <span className="menuBar__dropdownBadge">{option.badge}</span>
                          )}
                          {option.shortcut && (
                            <span className="menuBar__dropdownShortcut">{option.shortcut}</span>
                          )}
                          {option.icon && (
                            <span className="menuBar__dropdownIcon">{option.icon}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Regular menus */}
                {activeMenu === item && menuOptions[item] && (
                  <div className="menuBar__dropdown">
                    {menuOptions[item].map((option, idx) => (
                      <div 
                        key={idx} 
                        className="menuBar__dropdownItem" 
                        onClick={() => {
                          if (option === "About This Mac") {
                            handleAboutThisMac();
                          } else {
                            setActiveMenu(null);
                          }
                        }}
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
          <div ref={controlCenterButtonRef} className="menuBar__controlCenterBtn" onClick={toggleControlCenter}>
            <img src={controlCenterIcon} alt="Control Center" className="menuBar__iconImg" />
          </div>
          <img src={batteryIcon} alt="Battery" className="menuBar__iconImg" />
          <img src={wifiIcon} alt="Wifi" className="menuBar__iconImg" />
          <span className="menuBar__date">{fmtDate(time)}</span>
          <span className="menuBar__time">{fmtTime(time)}</span>
        </div>

        {/* ПАНЕЛЬ CONTROL CENTER */}
        {showControlCenter && (
          <div ref={controlCenterRef} className="controlCenter">
            <div className="controlCenter__grid">
              <div className="controlCenter__networkGroup">
                <div className="controlCenter__networkItem">
                  <FiWifi className="controlCenter__networkIcon" />
                  <div>
                    <div className="controlCenter__networkLabel">Wi-Fi</div>
                    <div className="controlCenter__networkStatus">{wifiName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ОКНО ABOUT THIS MAC */}
      {showAboutWindow && (
        <AboutThisMac onClose={closeAboutWindow} />
      )}
    </>
  );
}