import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import AppleIcon from "../../AppleIcon";

import { FiWifi } from "react-icons/fi";
import { BiBluetooth } from "react-icons/bi";

import batteryIcon       from "../../../assets/icons/menuBar/battery_charge.png";
import wifiIcon          from "../../../assets/icons/menuBar/wi-fi.png";
import controlCenterIcon from "../../../assets/icons/menuBar/control_center.svg";

import AboutThisMac from "./AboutThisMac/ATM";

// ─── Icon Components (memoized) ────────────────────────────────────────────────
const AirDropIcon = memo(({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 1a7 7 0 1 0 0 14A7 7 0 0 0 12 1zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 12 3zM6 17c0-2.76 2.69-5 6-5s6 2.24 6 5v.5H6V17z"/>
    <path d="M9.5 16.5 12 12l2.5 4.5h-5z" opacity=".7"/>
  </svg>
));

// ─── SmoothSlider ────────────────────────────────────────────────
// Прямое обновление DOM для плавной анимации без React re-renders
const SmoothSlider = memo(function SmoothSlider({ initialValue = 50, icon: Icon, endIcon: EndIcon, onValueChange }) {
  const trackRef = useRef(null);
  const inputRef = useRef(null);

  const updateSlider = useCallback((value) => {
    if (!trackRef.current) return;
    const pct = Math.max(0, Math.min(100, value));
    trackRef.current.style.setProperty('--thumb-pos', `${pct}%`);
    trackRef.current.style.setProperty('--fill-width', `${pct}%`);
    onValueChange?.(value);
  }, [onValueChange]);

  useEffect(() => {
    updateSlider(initialValue);
  }, [initialValue, updateSlider]);

  const handleChange = useCallback((e) => {
    updateSlider(+e.target.value);
  }, [updateSlider]);

  return (
    <div className="cc__slider-container">
      {Icon && <Icon size={14} className="cc__slider-icon" />}
      <div className="cc__slider-track" ref={trackRef}>
        <input
          ref={inputRef}
          type="range"
          min="0"
          max="100"
          defaultValue={initialValue}
          onChange={handleChange}
          className="cc__slider-input"
        />
      </div>
      {EndIcon && <EndIcon size={14} className="cc__slider-end-icon" />}
    </div>
  );
});

// ─── CcTile ──────────────────────────────────────────────────────
const CcTile = memo(function CcTile({ icon: Icon, label, active, onClick }) {
  return (
    <button className={`cc-tile${active ? " cc-tile--on" : ""}`} onClick={onClick}>
      <span className="cc-tile__icon"><Icon size={18} /></span>
      <span className="cc-tile__label">{label}</span>
    </button>
  );
});

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// ─── Icon Components (memoized) ────────────────────────────────────────────────
const FocusIcon = memo(({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
));

const SleepIcon = memo(({ size = 13 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M21 10.5V6a1 1 0 0 0-1-1h-5V3a1 1 0 0 0-2 0v2H8a1 1 0 0 0-1 1v10h14v-5.5zm-2 3.5H9V7h5v2a1 1 0 0 0 2 0V7h3v7z"/>
    <circle cx="15" cy="10" r="1.5"/>
  </svg>
));

const StageManagerIcon = memo(({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <rect x="2" y="4" width="13" height="16" rx="2" opacity="0.5"/>
    <rect x="9" y="4" width="13" height="16" rx="2"/>
  </svg>
));

const ScreenMirroringIcon = memo(({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <rect x="2" y="4" width="20" height="14" rx="2"/>
    <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

const DisplayIcon = memo(({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

const SoundIcon = memo(({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>
  </svg>
));

const AirPlayIcon = memo(({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M6 18l6-6 6 6H6zM6 14l6-6 6 6H6zM3 20h18v2H3v-2z"/>
  </svg>
));

const MusicRecognitionIcon = memo(({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
));

const ThemeIcon = memo(({ size = 18, isLight }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    {isLight ? (
      <>
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </>
    ) : (
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
    )}
  </svg>
));

// ─── Control Center Components ─────────────────────────────────────────────────
const NetRow = memo(function NetRow({ icon: Icon, label, sub, active, onClick }) {
  return (
    <div className={`cc-net-row ${active ? "cc-net-row--on" : ""}`} onClick={onClick}>
      <div className={`cc-net-icon ${active ? "cc-net-icon--on" : ""}`}>
        <Icon size={14} />
      </div>
      <div className="cc-net-text">
        <span className="cc-net-label">{label}</span>
        <span className="cc-net-sub">{sub}</span>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
export const MenuBar = memo(function MenuBar({ activeApp, openApp, onCloseWindow, onMinimizeWindow, onZoomWindow }) {
  const [time,      setTime]      = useState(new Date());
  const [activeMenu,setActiveMenu]= useState(null);
  const [showCC,    setShowCC]    = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light';
  });

  const [wifi,         setWifi]         = useState(true);
  const [bluetooth,    setBluetooth]    = useState(true);
  const [airdrop,      setAirdrop]      = useState(false);
  const [stageManager, setStageManager] = useState(false);
  const [screenMirror, setScreenMirror] = useState(false);

  const wifiName = "Kernel Panic Network";
  const barRef   = useRef(null);
  const ccRef    = useRef(null);
  const ccBtnRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isLightTheme) {
      root.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightTheme]);

  const toggleTheme = useCallback(() => {
    setIsLightTheme(prev => {
      const newValue = !prev;
      // Dispatch custom event for App.jsx
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { isLight: newValue } }));
      return newValue;
    });
  }, []);

  const appleMenuOptions = [
    { id:"about",    label:"About This Mac" },
    { id:"div1",     type:"divider" },
    { id:"settings", label:"System Settings…" },
    { id:"appstore", label:"App Store…" },
    { id:"div2",     type:"divider" },
    { id:"recent",   label:"Recent Items", submenu:true },
    { id:"div3",     type:"divider" },
    { id:"force",    label:`Force Quit ${activeApp||"Finder"}…`, shortcut:"⌥⇧⌘Q" },
    { id:"div4",     type:"divider" },
    { id:"sleep",    label:"Sleep" },
    { id:"restart",  label:"Restart…" },
    { id:"shutdown", label:"Shut Down…" },
    { id:"div5",     type:"divider" },
    { id:"lock",     label:"Lock Screen",  shortcut:"⌃⌘Q" },
    { id:"logout",   label:"Log Out ghost…", shortcut:"⇧⌘Q" },
  ];

  const menuOptions = {
    File:   ["New Folder","New Window","Open…","Close Window"],
    Edit:   ["Undo","Redo","Cut","Copy","Paste","Select All"],
    View:   ["Show Sidebar","Show Path Bar","Sort By","Clean Up"],
    Window: ["Minimize","Zoom","Bring All to Front","Close Window"],
    Help:   ["Search","About This Mac"],
  };

  const leftItems = [" ", activeApp||"Finder","File","Edit","View","Window","Help"];

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!activeMenu) return;
    const h = (e) => { if (barRef.current && !barRef.current.contains(e.target)) setActiveMenu(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [activeMenu]);

  useEffect(() => {
    if (!showCC) return;
    const h = (e) => {
      if (ccRef.current    && !ccRef.current.contains(e.target) &&
          ccBtnRef.current && !ccBtnRef.current.contains(e.target))
        setShowCC(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showCC]);

  const fmt    = (d) => d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",second:"2-digit",hour12:true});
  const fmtD   = (d) => d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  const onApple = (e) => { e.stopPropagation(); setActiveMenu(p => p===" "?null:" "); };
  const onAbout = () => { setActiveMenu(null); setShowAbout(true); };

  return (
    <>
      <div ref={barRef} className="menuBar">
        <div className="menuBar__left">
          {leftItems.map((item, i) => {
            const clickable = i > 1 || i === 0;
            return (
              <div key={i} className="menuBar__itemWrapper">
                <span
                  className={["menuBar__item", clickable?"isClickable":"", activeMenu===item?"isActive":"", i===0?"isApple":"", i<=1?"isBold":""].join(" ")}
                  onClick={(e) => { if(i===0) onApple(e); else if(clickable) setActiveMenu(activeMenu===item?null:item); }}
                >
                  {item === " " ? <AppleIcon/> : (i === 1 ? capitalizeFirstLetter(item) : item)}
                </span>

                {activeMenu===" " && i===0 && (
                  <div className="menuBar__dropdown apple-menu">
                    {appleMenuOptions.map((opt,idx) =>
                      opt.type==="divider"
                        ? <div key={idx} className="menuBar__dropdownDivider"/>
                        : (
                          <div key={idx} className="menuBar__dropdownItem"
                            onClick={() => {
                              if(opt.id==="about")    { onAbout(); return; }
                              if(opt.id==="settings") { openApp?.("settings"); setActiveMenu(null); return; }
                              setActiveMenu(null);
                            }}>
                            <span className="menuBar__dropdownLabel">{opt.label}</span>
                            {opt.shortcut && <span className="menuBar__dropdownShortcut">{opt.shortcut}</span>}
                            {opt.submenu  && <span className="menuBar__dropdownIcon">›</span>}
                          </div>
                        )
                    )}
                  </div>
                )}

                {activeMenu===item && menuOptions[item] && (
                  <div className="menuBar__dropdown">
                    {menuOptions[item].map((opt,idx) => (
                      <div key={idx} className="menuBar__dropdownItem"
                        onClick={() => {
                          if(opt==="About This Mac")   onAbout();
                          else if(opt==="Minimize")    onMinimizeWindow?.();
                          else if(opt==="Zoom")        onZoomWindow?.();
                          else if(opt==="Close Window") onCloseWindow?.();
                          else setActiveMenu(null);
                        }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="menuBar__right">
          <div ref={ccBtnRef} className="menuBar__controlCenterBtn" onClick={() => setShowCC(p=>!p)}>
            <img src={controlCenterIcon} alt="Control Center" className="menuBar__iconImg"/>
          </div>
          <img src={batteryIcon} alt="Battery" className="menuBar__iconImg"/>
          <img src={wifiIcon}    alt="Wi-Fi"   className="menuBar__iconImg"/>
          <span className="menuBar__date">{fmtD(time)}</span>
          <span className="menuBar__time">{fmt(time)}</span>
        </div>
      </div>

      {/* ══ CONTROL CENTER ════════════════════════════════════════ */}
      {showCC && (
        <div ref={ccRef} className="cc">

          {/* Top Row: Network + Sleep/Stage/Mirror */}
          <div className="cc__top">

            {/* Network group */}
            <div className="cc__network">
              <NetRow icon={FiWifi} label="Wi-Fi" sub={wifi ? wifiName : "Off"} active={wifi} onClick={()=>setWifi(p=>!p)}/>
              <NetRow icon={BiBluetooth} label="Bluetooth" sub={bluetooth ? "On" : "Off"} active={bluetooth} onClick={()=>setBluetooth(p=>!p)}/>
              <NetRow icon={AirDropIcon} label="AirDrop" sub={airdrop ? "Everyone" : "Off"} active={airdrop} onClick={()=>setAirdrop(p=>!p)}/>
            </div>

            {/* Right column */}
            <div className="cc__right-column">
              <div className="cc__sleep-tile">
                <div className="cc-sleep-icon">
                  <SleepIcon size={13} />
                </div>
                <span className="cc-sleep-label">Sleep</span>
              </div>
              
              <div className="cc__small-tiles">
                <CcTile icon={StageManagerIcon} label="Stage Manager" active={stageManager} onClick={()=>setStageManager(p=>!p)}/>
                <CcTile icon={ScreenMirroringIcon} label="Screen Mirroring" active={screenMirror} onClick={()=>setScreenMirror(p=>!p)}/>
              </div>
            </div>
          </div>

          {/* Display Slider */}
          <div className="cc__slider-card">
            <span className="cc__slider-title">Display</span>
            <SmoothSlider 
              initialValue={75} 
              icon={DisplayIcon}
            />
          </div>

          {/* Sound Slider */}
          <div className="cc__slider-card">
            <span className="cc__slider-title">Sound</span>
            <SmoothSlider 
              initialValue={55} 
              icon={SoundIcon}
              endIcon={AirPlayIcon}
            />
          </div>
    
          {/* Theme Toggle */}
          <div className="cc__sleep-tile" onClick={toggleTheme} style={{cursor: 'pointer'}}>
            <div className="cc-sleep-icon">
              <ThemeIcon size={14} isLight={isLightTheme} />
            </div>
            <span className="cc-sleep-label">{isLightTheme ? 'Light Mode' : 'Dark Mode'}</span>
          </div>

        </div>
      )}

      {showAbout && <AboutThisMac onClose={()=>setShowAbout(false)}/>}
    </>
  );
})

export default MenuBar;