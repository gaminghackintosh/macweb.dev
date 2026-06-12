import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const GeneralSettings = () => {
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC");
  const [autoTZ, setAutoTZ] = useState(true);

  return (
    <SettingsPanel title="General">
      <SettingsGroup label="Language & Region">
        <SettingsRow label="Language">
          <select className="ctrl-select" value={language} onChange={e => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Русский</option>
            <option>Español</option>
            <option>Deutsch</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Time Zone">
          <select className="ctrl-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
            <option>UTC</option>
            <option>America/New_York</option>
            <option>Europe/Moscow</option>
            <option>Asia/Tokyo</option>
          </select>
        </SettingsRow>
        <ToggleSwitch
          label="Set Time Zone Automatically"
          description="Uses your current location"
          checked={autoTZ}
          onChange={e => setAutoTZ(e.target.checked)}
        />
      </SettingsGroup>

      <SettingsGroup label="System">
        <SettingsRow label="Software Update" chevron onClick={() => {}}>
          <span className="sr-badge sr-badge--blue">Up to Date</span>
        </SettingsRow>
        <SettingsRow label="Date & Time" chevron onClick={() => {}} />
        <SettingsRow label="Storage" chevron onClick={() => {}} />
      </SettingsGroup>
    </SettingsPanel>
  );
};