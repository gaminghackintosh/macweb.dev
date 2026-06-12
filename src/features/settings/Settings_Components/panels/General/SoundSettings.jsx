import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const SoundSettings = () => {
  const [outputVolume, setOutputVolume] = useState(75);
  const [inputVolume, setInputVolume] = useState(50);
  const [alertVolume, setAlertVolume] = useState(50);
  const [outputDevice, setOutputDevice] = useState("MacBook Pro Speakers");
  const [inputDevice, setInputDevice] = useState("MacBook Pro Microphone");
  const [balance, setBalance] = useState(50);
  const [showVolume, setShowVolume] = useState(true);
  const [feedback, setFeedback] = useState(false);

  return (
    <SettingsPanel title="Sound">
      {/* Output */}
      <SettingsGroup label="Output">
        <SettingsRow label="Sound Output">
          <select className="ctrl-select" value={outputDevice} onChange={e => setOutputDevice(e.target.value)}>
            <option>MacBook Pro Speakers</option>
            <option>AirPods Pro</option>
            <option>External Headphones</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Output Volume">
          <div className="volume-control">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity={outputVolume > 0 ? 1 : 0.3} />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" opacity={outputVolume > 50 ? 1 : 0.3} />
            </svg>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={outputVolume} 
              onChange={e => setOutputVolume(e.target.value)} 
              className="ctrl-slider" 
            />
          </div>
        </SettingsRow>
        <SettingsRow label="Balance">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={balance} 
            onChange={e => setBalance(e.target.value)} 
            className="ctrl-slider" 
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Input */}
      <SettingsGroup label="Input">
        <SettingsRow label="Sound Input">
          <select className="ctrl-select" value={inputDevice} onChange={e => setInputDevice(e.target.value)}>
            <option>MacBook Pro Microphone</option>
            <option>AirPods Pro Microphone</option>
            <option>External Microphone</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Input Volume">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={inputVolume} 
            onChange={e => setInputVolume(e.target.value)} 
            className="ctrl-slider" 
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Sound Effects */}
      <SettingsGroup label="Sound Effects">
        <SettingsRow label="Alert Volume">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={alertVolume} 
            onChange={e => setAlertVolume(e.target.value)} 
            className="ctrl-slider" 
          />
        </SettingsRow>
        <ToggleSwitch 
          label="Play sound on startup" 
          checked={feedback} 
          onChange={e => setFeedback(e.target.checked)} 
        />
        <ToggleSwitch 
          label="Show volume in menu bar" 
          checked={showVolume} 
          onChange={e => setShowVolume(e.target.checked)} 
        />
        <SettingsRow label="Sound Effects" chevron onClick={() => {}} />
      </SettingsGroup>
    </SettingsPanel>
  );
};