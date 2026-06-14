import React, { useRef, useEffect, memo, useState, useCallback } from "react";
import { FiWifi, FiSun, FiMoon, FiClock, FiCamera, FiMusic, FiGrid, FiVolume2, FiHeadphones, FiPause, FiPlay, FiFastForward, FiActivity, FiRadio } from "react-icons/fi";
import { BiBluetooth } from "react-icons/bi";
import { WIFI_NAME, AirDropIcon, StageManagerIcon, ScreenMirroringIcon, SoundIcon, FocusIcon } from "./constants";
import { VerticalSlider } from "./VerticalSlider";

// ═══════════════════════════════════════════════════════════════════
//  MUSIC / NOW PLAYING WIDGET
// ═══════════════════════════════════════════════════════════════════

const MusicWidget = memo(({ track, artist, isPlaying, onToggle, coverUrl }) => {
  const [imgSrc, setImgSrc] = useState(coverUrl || defaultAlbumArt);
  const [isError, setIsError] = useState(false);

  return (
    <div className="cc-music-widget">
      <div className="cc-music-main-info">
        <div className="cc-music-art">
          {!isError ? (
            <img
              src={imgSrc}
              alt="Album Art"
              className="cc-music-art-img"
              onError={handleError}
              loading="lazy"
            />
          ) : (
            <div className="cc-music-art-placeholder">
              <FiMusic size={18} />
            </div>
          )}
        </div>
        <div className="cc-music-text">
          <div className="cc-music-title">{track}</div>
          {artist && <div className="cc-music-artist">{artist}</div>}
        </div>
      </div>
      <div className="cc-music-controls">
        <button className="cc-music-btn cc-music-btn--play" onClick={onToggle} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
        </button>
        <button className="cc-music-btn" aria-label="Fast forward">
          <FiFastForward size={16} />
        </button>
      </div>
    </div>
  );
});

const QuickAction = memo(({ icon: Icon, label, active, onClick }) => (
  <button
    className={`cc-quick-action${active ? " cc-quick-action--active" : ""}`}
    onClick={onClick}
    title={label}
  >
    <Icon size={18} />
  </button>
));

// Мемоизированные компоненты для быстрых действий
const ConnectivityItem = memo(({ icon: Icon, label, subLabel, active, activeColor, onClick }) => (
  <div className="cc-conn-item" onClick={onClick}>
    <div className={`cc-icon-circle ${active ? activeColor : ""}`}>
      <Icon size={14} />
    </div>
    <div className="cc-conn-text">
      <span className="cc-label-main">{label}</span>
      <span className="cc-label-sub">{subLabel}</span>
    </div>
  </div>
));

const FocusRow = memo(({ icon: Icon, label, active, activeColor, onClick }) => (
  <button className={`cc-focus-row ${active ? activeColor : ""}`} onClick={onClick}>
    <div className="cc-icon-circle">
      <Icon size={15} />
    </div>
    <span className="cc-label-main">{label}</span>
  </button>
));

const UtilitySquare = memo(({ icon: Icon, label, active, activeColor, onClick }) => (
  <button
    className={`cc-utility-square ${active ? activeColor : ""}`}
    onClick={onClick}
  >
    <Icon size={18} />
    <span className="cc-utility-label">{label}</span>
  </button>
));

export const ControlCenter = memo(function ControlCenter({
  wifi, setWifi,
  bluetooth, setBluetooth,
  airdrop, setAirdrop,
  focus, setFocus,
  stageManager, setStageManager,
  screenMirror, setScreenMirror,
  brightness, setBrightness,
  volume, setVolume,
  isLightTheme, toggleTheme,
  onClose
}) {
  const ccRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Мемоизация обработчиков
  const handleOutsideClick = useCallback((e) => {
    if (ccRef.current && !ccRef.current.contains(e.target)) onClose();
  }, [onClose]);

  const handleWifiToggle = useCallback(() => setWifi(w => !w), [setWifi]);
  const handleBluetoothToggle = useCallback(() => setBluetooth(b => !b), [setBluetooth]);
  const handleAirdropToggle = useCallback(() => setAirdrop(a => !a), [setAirdrop]);
  const handleFocusToggle = useCallback(() => setFocus(f => !f), [setFocus]);
  const handleStageManagerToggle = useCallback(() => setStageManager(s => !s), [setStageManager]);
  const handleScreenMirrorToggle = useCallback(() => setScreenMirror(s => !s), [setScreenMirror]);
  const handlePlayToggle = useCallback(() => setIsPlaying(p => !p), []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div ref={ccRef} className={`cc-panel ${isLightTheme ? "" : "dark-theme"}`}>

      {/* ── ACTIVE AUDIO CONTEXT ── */}
      <div className="cc-now-context">
        <span className="cc-context-icon">
          <FiHeadphones size={12} />
        </span>
        <span>Audio Routing Kit (ARK)</span>
      </div>

      {/* ── CONNECTIVITY (left) + FOCUS / STAGE MANAGER / SCREEN MIRRORING (right) ── */}
      <div className="cc-grid-main">

        <div className="cc-card cc-card--connectivity">
          <ConnectivityItem
            icon={FiWifi}
            label="Wi-Fi"
            subLabel={wifi ? WIFI_NAME : "Off"}
            active={wifi}
            activeColor="active-blue"
            onClick={handleWifiToggle}
          />
          <ConnectivityItem
            icon={BiBluetooth}
            label="Bluetooth"
            subLabel={bluetooth ? "On" : "Off"}
            active={bluetooth}
            activeColor="active-blue"
            onClick={handleBluetoothToggle}
          />
          <ConnectivityItem
            icon={AirDropIcon}
            label="AirDrop"
            subLabel={airdrop ? "Everyone" : "Off"}
            active={airdrop}
            activeColor="active-blue"
            onClick={handleAirdropToggle}
          />
        </div>

        <div className="cc-right-column">
          <FocusRow
            icon={FocusIcon}
            label="Focus"
            active={focus}
            activeColor="active-purple"
            onClick={handleFocusToggle}
          />

          <div className="cc-utilities-row">
            <UtilitySquare
              icon={StageManagerIcon}
              label="Stage Manager"
              active={stageManager}
              activeColor="active-opaque"
              onClick={handleStageManagerToggle}
            />
            <UtilitySquare
              icon={ScreenMirroringIcon}
              label="Screen Mirroring"
              active={screenMirror}
              activeColor="active-opaque"
              onClick={handleScreenMirrorToggle}
            />
          </div>
        </div>

      </div>

      {/* ── DISPLAY ── */}
      <div className="cc-card cc-card--slider-wrapper">
        <div className="cc-slider-header">
          <span className="cc-slider-title">Display</span>
        </div>
        <VerticalSlider
          value={brightness}
          icon={FiSun}
          onChange={setBrightness}
        />
      </div>

      {/* ── SOUND ── */}
      <div className="cc-card cc-card--slider-wrapper">
        <div className="cc-slider-header">
          <span className="cc-slider-title">Sound</span>
        </div>
        <div className="cc-sound-row">
          <VerticalSlider
            value={volume}
            icon={FiHeadphones}
            onChange={setVolume}
          />
          <button className="cc-output-btn" title="Output device">
            <FiRadio />
          </button>
        </div>
      </div>

      {/* ── MUSIC RECOGNITION ── */}
      <button className="cc-shazam-row">
        <span className="cc-shazam-icon">
          <FiActivity size={16} />
        </span>
        <span className="cc-shazam-text">Music Recognition</span>
      </button>

      {/* ── QUICK ACTIONS ── */}
      <div className="cc-quick-actions-shelf">
        <QuickAction icon={isLightTheme ? FiSun : FiMoon} label={isLightTheme ? "Light Mode" : "Dark Mode"} onClick={toggleTheme} />
        <QuickAction icon={FiGrid} label="Calculator" onClick={() => {}} />
        <QuickAction icon={FiClock} label="Clock" onClick={() => {}} />
        <QuickAction icon={FiCamera} label="Camera" onClick={() => {}} />
      </div>
    </div>
  );
});