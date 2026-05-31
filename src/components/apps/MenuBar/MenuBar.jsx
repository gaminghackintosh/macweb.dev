import React, { useState, useEffect, useRef } from "react";
import AppleIcon from "../../AppleIcon";

/* ===== ИКОНКИ ===== */
import { FiWifi, FiMonitor } from "react-icons/fi";
import { BiBluetooth } from "react-icons/bi";
import { MdOutlineBedtime, MdOutlineScreenShare, MdOutlineAirplay } from "react-icons/md";
import { TbLayoutSidebar } from "react-icons/tb";

/* ===== ASSETS ===== */
import batteryIcon from "../../../assets/icons/menuBar/battery_charge.png";
import wifiIcon from "../../../assets/icons/menuBar/wi-fi.png";
import controlCenterIcon from "../../../assets/icons/menuBar/control_center.svg";

// About This Mac
import AboutThisMac from "./AboutThisMac/ATM";

// ─── AirDrop icon  ──
const AirDropIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-7 14c0-2.21 3.134-4 7-4s7 1.79 7 4v1H5v-1z"/>
    <path d="M12 14l-4 6h8l-4-6z" opacity=".6"/>
  </svg>
);



export function MenuBar({ activeApp, openApp, onCloseWindow, onMinimizeWindow, onZoomWindow }) {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showAboutWindow, setShowAboutWindow] = useState(false);

  // ── Control Center state ──────────────────────────────────────────
  const [wifi, setWifi]                 = useState(true);
  const [bluetooth, setBluetooth]       = useState(true);
  const [airdrop, setAirdrop]           = useState(false);
  const [focus, setFocus]               = useState(false);
  const [stageManager, setStageManager] = useState(true);
  const [screenMirror, setScreenMirror] = useState(false);
  const [brightness, setBrightness]     = useState(75);
  const [volume, setVolume]             = useState(55);

  const wifiName = "Kernel Panic Network";

  const barRef                  = useRef(null);
  const controlCenterRef        = useRef(null);
  const controlCenterButtonRef  = useRef(null);

  const [darkMode, setDarkMode]     = useState(false);
const [nightShift, setNightShift] = useState(false);
const [trueTone, setTrueTone]     = useState(true);
const [audioOutput, setAudioOutput] = useState("MacBook Pro Speakers");

  // Apple menu items
  const appleMenuOptions = [
    { id: "about",    label: "About This Mac" },
    { id: "div1",     type: "divider" },
    { id: "settings", label: "System Settings…", action: () => openApp("settings") },
    { id: "appstore", label: "App Store…" },
    { id: "div2",     type: "divider" },
    { id: "recent",   label: "Recent Items", submenu: true },
    { id: "div3",     type: "divider" },
    { id: "force",    label: `Force Quit ${activeApp || "Finder"}…`, shortcut: "⌥⇧⌘Q" },
    { id: "div4",     type: "divider" },
    { id: "sleep",    label: "Sleep" },
    { id: "restart",  label: "Restart…" },
    { id: "shutdown", label: "Shut Down…" },
    { id: "div5",     type: "divider" },
    { id: "lock",     label: "Lock Screen", shortcut: "⌃⌘Q" },
    { id: "logout",   label: "Log Out ghost…", shortcut: "⇧⌘Q" },
  ];

  const menuOptions = {
    File:   ["New Folder", "New Window", "Open…", "Close Window"],
    Edit:   ["Undo", "Redo", "Cut", "Copy", "Paste", "Select All"],
    View:   ["Show Sidebar", "Show Path Bar", "Sort By", "Clean Up"],
    Window: ["Minimize", "Zoom", "Bring All to Front", "Close Window"],
    Help:   ["Search", "About This Mac"],
  };

  const leftItems = [" ", activeApp || "Finder", "File", "Edit", "View", "Window", "Help"];

  // Tick
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    if (!activeMenu) return;
    const h = (e) => { if (barRef.current && !barRef.current.contains(e.target)) setActiveMenu(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [activeMenu]);

  useEffect(() => {
    if (!showControlCenter) return;
    const h = (e) => {
      if (
        controlCenterRef.current && !controlCenterRef.current.contains(e.target) &&
        controlCenterButtonRef.current && !controlCenterButtonRef.current.contains(e.target)
      ) setShowControlCenter(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showControlCenter]);

  const fmtTime = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  const fmtDate = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const handleAppleClick = (e) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === " " ? null : " ");
  };

  const handleAboutThisMac = () => { setActiveMenu(null); setShowAboutWindow(true); };

  // ─── Иконки сети ─────────────────────────────────────────────────
  const NetworkIcon = ({ icon: Icon, active }) => (
    <span className={`cc-net-icon ${active ? "cc-net-icon--on" : "cc-net-icon--off"}`}>
      <Icon size={16} />
    </span>
  );

  // ─── Маленькие квадратные тайлы ──────────────────────────────────
  const Tile = ({ icon: Icon, label, active, onClick }) => (
    <button
      className={`cc-tile ${active ? "cc-tile--active" : ""}`}
      onClick={onClick}
      title={label}
    >
      <span className="cc-tile__icon"><Icon size={18} /></span>
      <span className="cc-tile__label">{label}</span>
    </button>
  );

  return (
    <>
      <div ref={barRef} className="menuBar">
        {/* ── LEFT ── */}
        <div className="menuBar__left">
          {leftItems.map((item, i) => {
            const isClickable = i > 1 || i === 0;
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
                  onClick={(e) => {
                    if (i === 0) handleAppleClick(e);
                    else if (isClickable) setActiveMenu(activeMenu === item ? null : item);
                  }}
                >
                  {item === " " ? <AppleIcon /> : item}
                </span>

                {/* Apple dropdown */}
                {activeMenu === " " && i === 0 && (
                  <div className="menuBar__dropdown apple-menu">
                    {appleMenuOptions.map((opt, idx) =>
                      opt.type === "divider"
                        ? <div key={idx} className="menuBar__dropdownDivider" />
                        : (
                          <div key={idx} className="menuBar__dropdownItem"
                            onClick={() => { opt.id === "about" ? handleAboutThisMac() : setActiveMenu(null); }}
                          >
                            <span className="menuBar__dropdownLabel">{opt.label}</span>
                            {opt.shortcut && <span className="menuBar__dropdownShortcut">{opt.shortcut}</span>}
                            {opt.submenu && <span className="menuBar__dropdownIcon">›</span>}
                          </div>
                        )
                    )}
                  </div>
                )}

                {/* Regular dropdowns */}
                {activeMenu === item && menuOptions[item] && (
                  <div className="menuBar__dropdown">
                    {menuOptions[item].map((opt, idx) => (
                      <div key={idx} className="menuBar__dropdownItem"
                        onClick={() => {
                          if (opt === "About This Mac") {
                            handleAboutThisMac();
                          } else if (opt === "Minimize") {
                            onMinimizeWindow();
                          } else if (opt === "Zoom") {
                            onZoomWindow();
                          } else if (opt === "Close Window") {
                            onCloseWindow();
                          } else {
                            setActiveMenu(null);
                          }
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT ── */}
        <div className="menuBar__right">
          <div ref={controlCenterButtonRef}
            className="menuBar__controlCenterBtn"
            onClick={() => setShowControlCenter(p => !p)}
          >
            <img src={controlCenterIcon} alt="Control Center" className="menuBar__iconImg" />
          </div>
          <img src={batteryIcon} alt="Battery" className="menuBar__iconImg" />
          <img src={wifiIcon}    alt="Wi-Fi"   className="menuBar__iconImg" />
          <span className="menuBar__date">{fmtDate(time)}</span>
          <span className="menuBar__time">{fmtTime(time)}</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          CONTROL CENTER
      ════════════════════════════════════════════ */}
      {showControlCenter && (
        <div ref={controlCenterRef} className="cc">

          {/* ── Row 1: network group + focus / stage / mirror ── */}
          <div className="cc__top-row">

            {/* Network group */}
            <div className="cc__network-group">
              {/* Wi-Fi */}
              <div
                className={`cc__net-item ${wifi ? "cc__net-item--active" : ""}`}
                onClick={() => setWifi(p => !p)}
              >
                <NetworkIcon icon={FiWifi} active={wifi} />
                <div className="cc__net-text">
                  <span className="cc__net-label">Wi-Fi</span>
                  <span className="cc__net-sub">{wifi ? wifiName : "Off"}</span>
                </div>
              </div>

              <div className="cc__net-divider" />

              {/* Bluetooth */}
              <div
                className={`cc__net-item ${bluetooth ? "cc__net-item--active" : ""}`}
                onClick={() => setBluetooth(p => !p)}
              >
                <NetworkIcon icon={BiBluetooth} active={bluetooth} />
                <div className="cc__net-text">
                  <span className="cc__net-label">Bluetooth</span>
                  <span className="cc__net-sub">{bluetooth ? "On" : "Off"}</span>
                </div>
              </div>

              <div className="cc__net-divider" />

              {/* AirDrop */}
              <div
                className={`cc__net-item ${airdrop ? "cc__net-item--active" : ""}`}
                onClick={() => setAirdrop(p => !p)}
              >
                <NetworkIcon icon={AirDropIcon} active={airdrop} />
                <div className="cc__net-text">
                  <span className="cc__net-label">AirDrop</span>
                  <span className="cc__net-sub">{airdrop ? "Everyone" : "Off"}</span>
                </div>
              </div>
            </div>

            {/* Right tiles column */}
            <div className="cc__tiles-col">
              <Tile icon={MdOutlineBedtime} label="Focus" active={focus} onClick={() => setFocus(p => !p)} />

              <div className="cc__tiles-row">
                <Tile icon={TbLayoutSidebar} label="Stage Manager" active={stageManager} onClick={() => setStageManager(p => !p)} />
                <Tile icon={MdOutlineScreenShare} label="Screen Mirroring" active={screenMirror} onClick={() => setScreenMirror(p => !p)} />
              </div>
            </div>
          </div>

          {/* ── Display ── */}
          <div className="cc__card">
            <div className="cc__card-label">Display</div>
            <div className="cc__slider-row">
              <FiMonitor size={15} className="cc__slider-icon" />
              <input
                type="range"
                min="0" max="100"
                value={brightness}
                onChange={e => setBrightness(e.target.value)}
                className="cc__slider"
                style={{ "--val": `${brightness}%` }}
              />
            </div>
            {/* Доп. кнопки (Dark Mode, Night Shift, True Tone) */}
            <div className="cc__option-row">
              <button
                className={`cc__option-btn ${darkMode ? "cc__option-btn--active" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span className="cc__option-btn-icon">🌙</span> Dark Mode
              </button>
              <button
                className={`cc__option-btn ${nightShift ? "cc__option-btn--active" : ""}`}
                onClick={() => setNightShift(!nightShift)}
              >
                <span className="cc__option-btn-icon">🌗</span> Night Shift
              </button>
              <button
                className={`cc__option-btn ${trueTone ? "cc__option-btn--active" : ""}`}
                onClick={() => setTrueTone(!trueTone)}
              >
                <span className="cc__option-btn-icon">👁️</span> True Tone
              </button>
            </div>
          </div>

          {/* ── Sound ── */}
          <div className="cc__card">
            <div className="cc__card-label">Sound</div>
            <div className="cc__slider-row">
              <span className="cc__headphone-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                  <path d="M12 3a9 9 0 0 0-9 9v3a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5.07A7 7 0 0 1 19 12h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a3 3 0 0 0 3-3v-3a9 9 0 0 0-9-9z"/>
                </svg>
              </span>
              <input
                type="range"
                min="0" max="100"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="cc__slider"
                style={{ "--val": `${volume}%` }}
              />
              <button className="cc__airplay-btn" title="AirPlay">
                <MdOutlineAirplay size={15} />
              </button>
            </div>
            {/* Текущий вывод */}
            <div className="cc__output-name">{audioOutput}</div>
          </div>

        </div>
      )}

      {showAboutWindow && <AboutThisMac onClose={() => setShowAboutWindow(false)} />}
    </>
  );
}