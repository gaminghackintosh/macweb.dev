import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";

export const UsersSettings = () => {
  const [isLocked, setIsLocked] = useState(true);
  
  const [users, setUsers] = useState([
    { id: 1, name: "ghost", type: "Administrator", avatar: "G", isLoggedIn: true },
    { id: 2, name: "Guest User", type: "Guest", avatar: "GU", isLoggedIn: false },
  ]);

  const unlockSettings = () => {
    setIsLocked(!isLocked);
  };

  return (
    <SettingsPanel title="Users & Groups">
      {/* Current User */}
      <SettingsGroup>
        <div className="current-user-card">
          <div className="user-avatar-large">
            {users[0].avatar}
          </div>
          <div className="user-info-large">
            <span className="user-name">{users[0].name}</span>
            <span className="user-type">{users[0].type}</span>
          </div>
          {isLocked ? (
            <button className="unlock-btn" onClick={unlockSettings}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Unlock
            </button>
          ) : (
            <button className="lock-btn" onClick={unlockSettings}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Lock
            </button>
          )}
        </div>
      </SettingsGroup>

      {/* Users List */}
      <SettingsGroup label="Users">
        {users.map(user => (
          <div key={user.id} className="user-list-row">
            <div className="user-avatar">
              {user.avatar}
            </div>
            <div className="user-details">
              <span className="user-list-name">{user.name}</span>
              <span className="user-list-type">{user.type}</span>
            </div>
            {user.isLoggedIn && <span className="logged-in-badge">Logged In</span>}
          </div>
        ))}
      </SettingsGroup>

      {/* Actions */}
      {!isLocked && (
        <SettingsGroup>
          <SettingsRow label="Add Account" chevron onClick={() => {}} />
        </SettingsGroup>
      )}

      {isLocked && (
        <div className="locked-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Click Unlock to make changes</span>
        </div>
      )}
    </SettingsPanel>
  );
};