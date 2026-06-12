import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

const ACCENT_COLORS = [
  { id: "blue",   hex: "#007aff", label: "Blue"   },
  { id: "purple", hex: "#af52de", label: "Purple" },
  { id: "pink",   hex: "#ff375f", label: "Pink"   },
  { id: "red",    hex: "#ff3b30", label: "Red"    },
  { id: "orange", hex: "#ff9500", label: "Orange" },
  { id: "yellow", hex: "#ffcc00", label: "Yellow" },
  { id: "green",  hex: "#34c759", label: "Green"  },
  { id: "gray",   hex: "#8e8e93", label: "Graphite"},
];

export const AppearanceSettings = () => {
  const [appearance, setAppearance] = useState("dark");
  const [accent, setAccent]         = useState("blue");
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showScrollbars, setShowScrollbars] = useState("automatic");

  return (
    <SettingsPanel title="Appearance">
      {/* Appearance mode */}
      <SettingsGroup label="Appearance">
        <SettingsRow label="Mode">
          <div className="appearance-mode-picker">
            {["light", "dark", "auto"].map(mode => (
              <button
                key={mode}
                className={`mode-btn${appearance === mode ? " mode-btn--active" : ""}`}
                onClick={() => setAppearance(mode)}
              >
                <span className={`mode-icon mode-icon--${mode}`} />
                <span className="mode-label">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </button>
            ))}
          </div>
        </SettingsRow>
        <ToggleSwitch
          label="Auto Switch"
          description="Switch between Light and Dark based on time of day"
          checked={autoSwitch}
          onChange={e => setAutoSwitch(e.target.checked)}
        />
      </SettingsGroup>

      {/* Accent color */}
      <SettingsGroup label="Accent Color">
        <SettingsRow label="Highlight Color">
          <div className="accent-palette">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.id}
                title={c.label}
                className={`accent-swatch${accent === c.id ? " accent-swatch--active" : ""}`}
                style={{ background: c.hex }}
                onClick={() => setAccent(c.id)}
              />
            ))}
          </div>
        </SettingsRow>
      </SettingsGroup>

      {/* Accessibility */}
      <SettingsGroup label="Accessibility">
        <ToggleSwitch
          label="Reduce Motion"
          description="Limits the use of motion effects"
          checked={reduceMotion}
          onChange={e => setReduceMotion(e.target.checked)}
        />
        <SettingsRow label="Show Scroll Bars">
          <select
            className="ctrl-select"
            value={showScrollbars}
            onChange={e => setShowScrollbars(e.target.value)}
          >
            <option value="automatic">Automatically</option>
            <option value="scrolling">When Scrolling</option>
            <option value="always">Always</option>
          </select>
        </SettingsRow>
      </SettingsGroup>
    </SettingsPanel>
  );
};