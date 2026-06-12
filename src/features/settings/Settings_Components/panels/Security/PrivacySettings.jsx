import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const PrivacySettings = () => {
  const [location, setLocation] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  const [personalized, setPersonalized] = useState(true);

  const locationApps = [
    { name: "Maps", allowed: true },
    { name: "Weather", allowed: true },
    { name: "Photos", allowed: false },
    { name: "Safari", allowed: true },
  ];

  return (
    <SettingsPanel title="Privacy & Security">
      {/* Location Services */}
      <SettingsGroup label="Location Services">
        <ToggleSwitch 
          label="Location Services" 
          description="Allow apps to access your location" 
          checked={location} 
          onChange={e => setLocation(e.target.checked)} 
        />
        {location && (
          <div className="privacy-apps-list">
            {locationApps.map((app, idx) => (
              <div key={idx} className="privacy-app-row">
                <span className="privacy-app-name">{app.name}</span>
                <span className={`privacy-app-status ${app.allowed ? 'allowed' : 'denied'}`}>
                  {app.allowed ? 'Allowed' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        )}
      </SettingsGroup>

      {/* Analytics */}
      <SettingsGroup label="Analytics & Improvements">
        <ToggleSwitch 
          label="Share Mac Analytics" 
          description="Help improve macOS by sharing usage data" 
          checked={analytics} 
          onChange={e => setAnalytics(e.target.checked)} 
        />
        <ToggleSwitch 
          label="Allow Advertising Tracking" 
          description="Let advertisers show you personalized ads" 
          checked={ads} 
          onChange={e => setAds(e.target.checked)} 
        />
      </SettingsGroup>

      {/* Personalization */}
      <SettingsGroup label="Personalization">
        <ToggleSwitch 
          label="Personalized Recommendations" 
          description="Get personalized suggestions based on your usage" 
          checked={personalized} 
          onChange={e => setPersonalized(e.target.checked)} 
        />
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup label="Security">
        <SettingsRow label="Firewall" chevron onClick={() => {}} />
        <SettingsRow label="FileVault" value="On" chevron onClick={() => {}} />
        <SettingsRow label="Find My Mac" value="Enabled" chevron onClick={() => {}} />
      </SettingsGroup>
    </SettingsPanel>
  );
};