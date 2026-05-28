import React, { useState, useEffect, useContext, memo } from "react";
import { AssetIcon } from "../AssetIcon";
import { APPS } from "../../constants/apps";
import { SidebarIcon } from "./SidebarIcon";
import { WindowContext } from "../AppWindow/AppWindow"; 

const FinderContent = memo(function FinderContent({ openApp, onClose, onMinimize, onMaximize }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("macos");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { onTitleMouseDown } = useContext(WindowContext);
  const [tabs, setTabs] = useState([
    { id: 0, label: "Macintosh HD", folder: "macos" }
  ]);
  const [columnWidths, setColumnWidths] = useState({
    name: 300,
    size: 100,
    modified: 150
  });

  const getAppIcon = (appName) => {
    const app = APPS.find(a => a.name.toLowerCase() === appName.toLowerCase().replace('.app', ''));
    if (app) {
      return {
        type: "image",
        path: app.iconPath,
        fallback: app.icon || getFallbackForApp(app.id)
      };
    }
    return null;
  };

  const getFallbackForApp = (appId) => {
    const fallbacks = {
      finder: "🗂",
      safari: "🧭",
      notes: "📝",
      terminal: "💻",
      music: "🎵",
      settings: "⚙️"
    };
    return fallbacks[appId] || "📱";
  };

  const sidebar = {
    favourites: [
      { name: "AirDrop", action: "airdrop" },
      { name: "Recents", action: "recents" },
      { name: "Applications", action: "applications" },
      { name: "Desktop", action: "desktop" },
      { name: "Documents", action: "documents" },
      { name: "Downloads", action: "downloads" },
    ],
    icloud: [
      { name: "iCloud Drive", action: "icloud" },
      { name: "Shared", action: "shared" },
    ],
    locations: [
      { name: "macOS", action: "macos" },
      { name: "Network", action: "network" },
    ],
    tags: [
      { name: "Red", color: "#ff5a5a", action: "red" },
      { name: "Orange", color: "#ff9f4a", action: "orange" },
      { name: "Yellow", color: "#ffd64a", action: "yellow" },
      { name: "Green", color: "#4cd964", action: "green" },
      { name: "Blue", color: "#5ac8fa", action: "blue" },
      { name: "Purple", color: "#bf5af2", action: "purple" },
    ],
  };

  const filesystem = {
    macos: [
      { name: "Applications", type: "folder", icon: "📱", size: "--", modified: "Today", path: "/Applications" },
      { name: "Library", type: "folder", icon: "📚", size: "--", modified: "Today", path: "/Library" },
      { name: "System", type: "folder", icon: "⚙️", size: "--", modified: "Yesterday", path: "/System" },
      { name: "Users", type: "folder", icon: "👤", size: "--", modified: "Today", path: "/Users" },
      { name: "README.md", type: "file", icon: "📝", size: "4.2 KB", modified: "Today", preview: "# hackintosh.web\n\nA web-native macOS experience built with React.\n\n## Features\n- Native-like macOS interface\n- Working Finder with file preview\n- Terminal emulator\n- Notes app\n- Settings panel" },
      { name: "LICENSE", type: "file", icon: "📄", size: "1.2 KB", modified: "Yesterday", preview: "MIT License\n\nCopyright (c) 2024 hackintosh.web\n\nPermission is hereby granted..." },
    ],
    applications: [
      { name: "Finder.app", type: "app", icon: getAppIcon("Finder"), size: "12 MB", modified: "Today", exec: "finder", isImageIcon: true },
      { name: "Safari.app", type: "app", icon: getAppIcon("Safari"), size: "28 MB", modified: "Today", exec: "safari", isImageIcon: true },
      { name: "Notes.app", type: "app", icon: getAppIcon("Notes"), size: "6 MB", modified: "Yesterday", exec: "notes", isImageIcon: true },
      { name: "Terminal.app", type: "app", icon: getAppIcon("Terminal"), size: "4 MB", modified: "Today", exec: "terminal", isImageIcon: true },
      { name: "Settings.app", type: "app", icon: getAppIcon("Settings"), size: "8 MB", modified: "Today", exec: "settings", isImageIcon: true },
      { name: "Music.app", type: "app", icon: getAppIcon("Music"), size: "45 MB", modified: "Yesterday", exec: "music", isImageIcon: true },
    ],
    desktop: [
      { name: "Macintosh HD", type: "alias", icon: "💾", size: "--", modified: "Today", target: "macos" },
      { name: "hackintosh.web", type: "file", icon: "🌐", size: "2 KB", modified: "Just now", preview: "macOS web simulation built with React" },
      { name: "Projects", type: "folder", icon: "📁", size: "--", modified: "2 days ago", path: "projects" },
      { name: "README.md", type: "file", icon: "📝", size: "4.2 KB", modified: "Today", preview: "# hackintosh.web\n\nA web-native macOS experience..." },
    ],
    documents: [
      { name: "Projects", type: "folder", icon: "📁", size: "--", modified: "2 days ago", path: "projects" },
      { name: "Resume.pdf", type: "file", icon: "📄", size: "128 KB", modified: "Last week", preview: "Professional experience in full-stack development..." },
      { name: "Notes.txt", type: "file", icon: "📝", size: "2 KB", modified: "Yesterday", preview: "- Coffee ☕\n- Matcha 🍵\n- Energy drinks 🔋\n- More RAM" },
    ],
    downloads: [
      { name: "hackintosh-web.zip", type: "archive", icon: "📦", size: "8.2 MB", modified: "Today", preview: "Archive contents: source code, assets, documentation" },
      { name: "wallpaper.png", type: "image", icon: "🖼", size: "3.1 MB", modified: "Yesterday", preview: "macOS default wallpaper" },
    ],
    projects: [
      { name: "hackintosh.web", type: "folder", icon: "📁", size: "--", modified: "Just now", path: "hackintosh.web" },
      { name: "portfolio", type: "folder", icon: "📁", size: "--", modified: "3 days ago", path: "portfolio" },
    ],
    "hackintosh.web": [
      { name: "src", type: "folder", icon: "📁", size: "--", modified: "Just now", path: "src" },
      { name: "public", type: "folder", icon: "📁", size: "--", modified: "Just now", path: "public" },
      { name: "package.json", type: "file", icon: "📦", size: "1.2 KB", modified: "Just now", preview: JSON.stringify({ name: "hackintosh.web", version: "1.0.0" }, null, 2) },
      { name: "README.md", type: "file", icon: "📝", size: "3.4 KB", modified: "Just now", preview: "# hackintosh.web\n\nmacOS experience in your browser" },
    ],
    portfolio: [
      { name: "index.html", type: "file", icon: "🌐", size: "9 KB", modified: "3 days ago", preview: "<!DOCTYPE html>\n<html>\n <head>\n <title>Portfolio</title>\n </head>\n</html>" },
      { name: "style.css", type: "file", icon: "🎨", size: "15 KB", modified: "3 days ago", preview: "body {\n margin: 0;\n padding: 0;\n font-family: -apple-system, sans-serif;\n}" },
    ],
    recents: [],
    network: [
      { name: "hackintosh.web.local", type: "computer", icon: "🖥", size: "--", modified: "Today" },
    ],
    icloud: [],
    shared: [],
  };

  const getRecents = () => {
    const recent = [];
    const addIfRecent = (items) => {
      items.forEach(item => {
        if (item.modified === "Today" || item.modified === "Just now") {
          recent.push({ ...item, source: "Recent" });
        }
      });
    };
    addIfRecent(filesystem.macos);
    addIfRecent(filesystem.applications);
    addIfRecent(filesystem.documents);
    addIfRecent(filesystem.downloads);
    return recent.slice(0, 10);
  };

  const getCurrentFiles = () => {
    let files = [];
    if (currentFolder === "recents") {
      files = getRecents();
    } else if (currentFolder === "airdrop") {
      return [];
    } else if (filesystem[currentFolder]) {
      files = filesystem[currentFolder];
    } else {
      for (const [key, value] of Object.entries(filesystem)) {
        const found = value.find(f => f.name === currentFolder && f.type === "folder");
        if (found && found.path && filesystem[found.path]) {
          files = filesystem[found.path];
          break;
        }
      }
    }
    if (searchQuery) {
      files = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return files;
  };

  const currentFiles = getCurrentFiles();
  const selectedItem = currentFiles.find(f => f.name === selectedFile);
  const isGridView = viewMode === "grid";
  const isColumnView = viewMode === "columns";

  // Current folder display name
  const getFolderDisplayName = () => {
    const map = {
      macos: "Macintosh HD",
      applications: "Applications",
      desktop: "Desktop",
      documents: "Documents",
      downloads: "Downloads",
      recents: "Recents",
      airdrop: "AirDrop",
      network: "Network",
      icloud: "iCloud Drive",
      shared: "Shared",
    };
    return map[currentFolder] || currentFolder;
  };

  const navigateToFolder = (folderName, targetPath) => {
    const folderMap = {
      "Macintosh HD": "macos", "macOS": "macos",
      "Applications": "applications", "Documents": "documents",
      "Downloads": "downloads", "Desktop": "desktop",
      "Projects": "projects", "Network": "network",
      "Recents": "recents", "AirDrop": "airdrop",
      "iCloud Drive": "icloud", "Shared": "shared",
    };
    if (targetPath) {
      setCurrentFolder(targetPath);
    } else if (folderMap[folderName]) {
      setCurrentFolder(folderMap[folderName]);
    } else if (filesystem[folderName]) {
      setCurrentFolder(folderName);
    }
    setSelectedFile(null);
  };

  const openApplication = (appId) => {
    if (openApp) {
      openApp(appId);
    } else if (window.openAppFromFinder) {
      window.openAppFromFinder(appId);
    }
  };

  const formatDate = (dateStr) => {
    if (dateStr === "Today") return new Date().toLocaleDateString();
    if (dateStr === "Yesterday") return new Date(Date.now() - 86400000).toLocaleDateString();
    if (dateStr === "Just now") return new Date().toLocaleTimeString();
    return dateStr;
  };

  const renderIcon = (file) => {
    if (file.isImageIcon && file.icon && file.icon.type === "image") {
      const isValidPath = file.icon.path && (file.icon.path.includes('.png') || file.icon.path.includes('.svg') || file.icon.path.includes('.ico'));
      if (isValidPath) {
        return (
          <AssetIcon
            path={file.icon.path}
            fallback={file.icon.fallback || "⚙️"}
            size={isGridView ? 48 : 20}
            alt={file.name}
            style={{ borderRadius: isGridView ? 12 : 4 }}
            imgStyle={{ objectFit: 'contain' }}
          />
        );
      }
    }
    const emojiMap = {
      "Settings.app": "⚙️", "Finder.app": "🗂",
      "Safari.app": "🧭", "Notes.app": "📝",
      "Terminal.app": "💻", "Music.app": "🎵"
    };
    return (
      <span className="finder-list-icon-emoji" style={{ fontSize: isGridView ? 48 : 18 }}>
        {emojiMap[file.name] || file.icon || "📱"}
      </span>
    );
  };

  const addTab = () => {
    const newId = Date.now();
    const newTab = { id: newId, label: getFolderDisplayName(), folder: currentFolder };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      const newActive = newTabs[Math.max(0, idx - 1)];
      setActiveTab(newActive.id);
      setCurrentFolder(newActive.folder);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab.id);
    setCurrentFolder(tab.folder);
    setSelectedFile(null);
  };

  return (
    <div className="finder">
      <div className="finder-layout">

        {/* ── SIDEBAR ── */}
        <div className="finder-sidebar">
          <div className="finder-traffic-lights"
              onMouseDown={(e) => {
              // Разрешаем перетаскивание, если клик НЕ по кнопкам управления
              if (!e.target.closest('.finder-traffic-light')) {
                onTitleMouseDown(e);
              }
            }}
            >
            <button
              className="finder-traffic-light finder-traffic-light--close"
              onClick={onClose}
              title="Close"
            />
            <button
              className="finder-traffic-light finder-traffic-light--minimize"
              onClick={onMinimize}
              title="Minimize"
            />
            <button
              className="finder-traffic-light finder-traffic-light--maximize"
              onClick={onMaximize}
              title="Maximize"
            />
          </div>

          <div className="finder-sidebar-inner">
            {/* Favourites */}
            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">Favourites</div>
              {sidebar.favourites.map(item => (
                <div
                  key={item.name}
                  className={`finder-sidebar-item ${currentFolder === item.action ? "active" : ""}`}
                  onClick={() => navigateToFolder(item.name)}
                >
                  <span className="finder-sidebar-icon">
                    <SidebarIcon name={item.action} />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            {/* iCloud */}
            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">iCloud</div>
              {sidebar.icloud.map(item => (
                <div
                  key={item.name}
                  className={`finder-sidebar-item ${currentFolder === item.action ? "active" : ""}`}
                  onClick={() => navigateToFolder(item.name)}
                >
                  <span className="finder-sidebar-icon">
                    <SidebarIcon name={item.action} />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">Locations</div>
              {sidebar.locations.map(item => (
                <div
                  key={item.name}
                  className={`finder-sidebar-item ${currentFolder === item.action ? "active" : ""}`}
                  onClick={() => navigateToFolder(item.name)}
                >
                  <span className="finder-sidebar-icon">
                    <SidebarIcon name={item.action} />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">Tags</div>
              {sidebar.tags.map(tag => (
                <div key={tag.name} className="finder-sidebar-item">
                  <span className="finder-tag-dot" style={{ backgroundColor: tag.color }} />
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="finder-right">

          {/* Toolbar */}
          <div
            className="finder-toolbar"
            onMouseDown={(e) => {
              if (!e.target.closest('button, input, .finder-tab, .finder-tab-add, .finder-view-controls, .finder-search-container')) {
                onTitleMouseDown(e);
              }
            }}
          >
            <div className="finder-toolbar-nav">
              <button className="finder-toolbar-button" onClick={() => navigateToFolder("macos")}>◀</button>
              <button className="finder-toolbar-button">▶</button>
            </div>

            <div className="finder-toolbar-title">{getFolderDisplayName()}</div>

            <div className="finder-toolbar-actions">
              <div className="finder-view-controls">
                <button className={`finder-view-button ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
                <button className={`finder-view-button ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>▦</button>
                <button className={`finder-view-button ${viewMode === "columns" ? "active" : ""}`} onClick={() => setViewMode("columns")}>▯</button>
              </div>
              <div className="finder-search-container">
                <input
                  type="text"
                  placeholder="Search"
                  className="finder-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs row */}
          <div className="finder-tabs">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`finder-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => switchTab(tab)}
              >
                <span className="finder-tab-label">{tab.label}</span>
                {tabs.length > 1 && (
                  <button className="finder-tab-close" onClick={(e) => closeTab(tab.id, e)}>×</button>
                )}
              </div>
            ))}
            <button className="finder-tab-add" onClick={addTab} title="New Tab">+</button>
          </div>

          {/* File area */}
          <div className="finder-file-area">
            <div className="finder-path-bar">
              <span className="finder-path-item">{getFolderDisplayName()}</span>
            </div>

            {/* Column headers (list view) */}
            {!isGridView && !isColumnView && (
              <div className="finder-column-headers">
                <span className="finder-column-header" style={{ width: columnWidths.name }}>Name</span>
                <span className="finder-column-header" style={{ width: columnWidths.size }}>Size</span>
                <span className="finder-column-header" style={{ width: columnWidths.modified }}>Date Modified</span>
              </div>
            )}

            {/* Grid view */}
            {isGridView && (
              <div className="finder-grid-container">
                {currentFiles.length === 0 ? (
                  <div className="finder-empty-state">
                    <span className="finder-empty-icon">📭</span>
                    <span>This folder is empty.</span>
                  </div>
                ) : (
                  currentFiles.map(file => (
                    <div
                      key={file.name}
                      className={`finder-grid-item ${selectedFile === file.name ? "selected" : ""}`}
                      onClick={() => setSelectedFile(file.name)}
                      onDoubleClick={() => {
                        if (file.type === "folder") navigateToFolder(file.name, file.path);
                        else if (file.type === "app") openApplication(file.exec);
                      }}
                    >
                      <div className="finder-grid-icon">{renderIcon(file)}</div>
                      <span className="finder-grid-name">{file.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Column view */}
            {isColumnView && (
              <div className="finder-column-container">
                <div className="finder-column-list">
                  {currentFiles.map(file => (
                    <div
                      key={file.name}
                      className={`finder-column-item ${selectedFile === file.name ? "selected" : ""}`}
                      onClick={() => setSelectedFile(file.name)}
                      onDoubleClick={() => {
                        if (file.type === "folder") navigateToFolder(file.name, file.path);
                        else if (file.type === "app") openApplication(file.exec);
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{file.isImageIcon ? "📱" : file.icon}</span>
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
                {selectedItem && (
                  <div className="finder-preview-column">
                    <div className="finder-preview-header">
                      <div className="finder-preview-icon">
                        {selectedItem.isImageIcon && selectedItem.icon ? (
                          <AssetIcon path={selectedItem.icon.path} fallback={selectedItem.icon.fallback} size={64} alt={selectedItem.name} style={{ borderRadius: 14 }} />
                        ) : (
                          <span style={{ fontSize: 64 }}>{selectedItem.icon}</span>
                        )}
                      </div>
                      <div>
                        <div className="finder-preview-title">{selectedItem.name}</div>
                        <div className="finder-preview-type">{selectedItem.type.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="finder-preview-info">
                      <div><strong>Size:</strong> {selectedItem.size}</div>
                      <div><strong>Modified:</strong> {formatDate(selectedItem.modified)}</div>
                      <div><strong>Kind:</strong> {selectedItem.type === "folder" ? "Folder" : selectedItem.type === "app" ? "Application" : "Document"}</div>
                    </div>
                    {selectedItem.preview && (
                      <div className="finder-preview-content">{selectedItem.preview}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* List view */}
            {!isGridView && !isColumnView && (
              <div className="finder-list-container">
                {currentFiles.length === 0 ? (
                  <div className="finder-empty-state">
                    <span className="finder-empty-icon">📭</span>
                    <span>This folder is empty.</span>
                  </div>
                ) : (
                  currentFiles.map(file => (
                    <div
                      key={file.name}
                      className={`finder-list-item ${selectedFile === file.name ? "selected" : ""}`}
                      onClick={() => setSelectedFile(file.name)}
                      onDoubleClick={() => {
                        if (file.type === "folder") navigateToFolder(file.name, file.path);
                        else if (file.type === "app") openApplication(file.exec);
                      }}
                    >
                      <span className="finder-list-icon" style={{ width: columnWidths.name }}>
                        <span className="finder-list-icon-wrapper">{renderIcon(file)}</span>
                        <span>{file.name}</span>
                      </span>
                      <span className="finder-list-size" style={{ width: columnWidths.size }}>{file.size}</span>
                      <span className="finder-list-modified" style={{ width: columnWidths.modified }}>{formatDate(file.modified)}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Status bar */}
            <div className="finder-status-bar">
              {currentFiles.length} item{currentFiles.length !== 1 ? "s" : ""}
              {selectedFile && ` • ${selectedFile} selected`}
            </div>
          </div>

          {/* Preview panel (list view) */}
          {!isGridView && !isColumnView && selectedItem && (
            <div className="finder-preview-panel">
              <div className="finder-preview-header">
                <div className="finder-preview-icon">
                  {selectedItem.isImageIcon && selectedItem.icon ? (
                    <AssetIcon path={selectedItem.icon.path} fallback={selectedItem.icon.fallback} size={64} alt={selectedItem.name} style={{ borderRadius: 14 }} />
                  ) : (
                    <span style={{ fontSize: 64 }}>{selectedItem.icon}</span>
                  )}
                </div>
                <div>
                  <div className="finder-preview-title">{selectedItem.name}</div>
                  <div className="finder-preview-type">{selectedItem.type.toUpperCase()}</div>
                </div>
              </div>
              <div className="finder-preview-info">
                <div><strong>Size:</strong> {selectedItem.size}</div>
                <div><strong>Modified:</strong> {formatDate(selectedItem.modified)}</div>
                <div><strong>Kind:</strong> {selectedItem.type === "folder" ? "Folder" : selectedItem.type === "app" ? "Application" : "Document"}</div>
              </div>
              {selectedItem.preview && (
                <div className="finder-preview-content">{selectedItem.preview}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
},
)

export default FinderContent;