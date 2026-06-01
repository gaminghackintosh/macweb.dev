import React, { useState, useEffect, useContext, memo } from "react";
import { AssetIcon } from "../AssetIcon";
import { APPS } from "../../constants/apps";
import { SidebarIcon } from "./SidebarIcon";
import { WindowContext } from "../AppWindow/AppWindow"; 

import { useContextMenu } from "./../../hooks/useContextMenu";
import { ContextMenu } from "./../ContextMenu/ContextMenu";

// Набор встроенных векторных иконок в стиле macOS
const FinderSVG = {
  Folder: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5.5C4 4.67157 4.67157 4 5.5 4H9.58579C9.98361 4 10.3652 4.15804 10.6464 4.43934L12.5607 6.35355C12.842 6.63485 13.2236 6.79289 13.6214 6.79289H18.5C19.3284 6.79289 20 7.46447 20 8.29289V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V5.5Z" fill="#2eb0ff" />
      <path opacity="0.2" d="M4 8H20V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V8Z" fill="#007aff" />
    </svg>
  ),
  File: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3.5C6 2.67157 6.67157 2 7.5 2H13.5L18 6.5V20.5C18 21.3284 17.3284 22 16.5 22H7.5C6.67157 22 6 21.3284 6 20.5V3.5Z" fill="#ffffff" fillOpacity="0.15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M13.5 2V5.5C13.5 6.05228 13.9477 6.5 14.5 6.5H18" fill="rgba(255,255,255,0.3)" />
      <line x1="9" y1="11" x2="15" y2="11" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="14" x2="15" y2="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="17" x2="13" y2="17" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  CodeFile: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3.5C6 2.67157 6.67157 2 7.5 2H13.5L18 6.5V20.5C18 21.3284 17.3284 22 16.5 22H7.5C6.67157 22 6 21.3284 6 20.5V3.5Z" fill="#3a3a3c" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <path d="M13.5 2V5.5C13.5 6.05228 13.9477 6.5 14.5 6.5H18" fill="rgba(255,255,255,0.3)" />
      <path d="M8.5 12L7 13.5L8.5 15" stroke="#0a84ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 12L15 13.5L13.5 15" stroke="#0a84ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="11.832" y1="11.5" x2="10.168" y2="15.5" stroke="#0a84ff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Drive: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="14" width="18" height="6" rx="1.5" fill="#a2a2a7" />
      <circle cx="17.5" cy="17" r="1" fill="#34c759" />
      <path d="M5 14L7.5 5.5C7.75 4.5 8.5 4 9.5 4H14.5C15.5 4 16.25 4.5 16.5 5.5L19 14H5Z" fill="rgba(255,255,255,0.15)" stroke="#a2a2a7" strokeWidth="1" />
    </svg>
  ),
  Image: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#34c759" fillOpacity="0.2" stroke="#34c759" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#34c759" />
      <path d="M4.5 18.5L9 13L13.5 17.5L16.5 14.5L19.5 17.5V18.5H4.5Z" fill="#34c759" />
    </svg>
  ),
  Archive: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3.5C6 2.67157 6.67157 2 7.5 2H16.5C17.3284 2 18 2.67157 18 3.5V20.5C18 21.3284 17.3284 22 16.5 22H7.5C6.67157 22 6 21.3284 6 20.5V3.5Z" fill="#ff9f0a" fillOpacity="0.2" stroke="#ff9f0a" strokeWidth="1.5" />
      <rect x="10" y="5" width="4" height="10" rx="0.5" fill="#ff9f0a" />
      <line x1="10" y1="7" x2="14" y2="7" stroke="#ffffff" strokeWidth="1" />
      <line x1="10" y1="10" x2="14" y2="10" stroke="#ffffff" strokeWidth="1" />
      <line x1="10" y1="13" x2="14" y2="13" stroke="#ffffff" strokeWidth="1" />
    </svg>
  ),
  System: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5.5C4 4.67157 4.67157 4 5.5 4H9.58579C9.98361 4 10.3652 4.15804 10.6464 4.43934L12.5607 6.35355C12.842 6.63485 13.2236 6.79289 13.6214 6.79289H18.5C19.3284 6.79289 20 7.46447 20 8.29289V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V5.5Z" fill="#ff453a" fillOpacity="0.2" stroke="#ff453a" strokeWidth="1.5" />
      <circle cx="12" cy="13" r="2.5" stroke="#ff453a" strokeWidth="1.5" />
    </svg>
  ),
  Users: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5.5C4 4.67157 4.67157 4 5.5 4H9.58579C9.98361 4 10.3652 4.15804 10.6464 4.43934L12.5607 6.35355C12.842 6.63485 13.2236 6.79289 13.6214 6.79289H18.5C19.3284 6.79289 20 7.46447 20 8.29289V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V5.5Z" fill="#bf5af2" fillOpacity="0.2" stroke="#bf5af2" strokeWidth="1.5" />
      <circle cx="12" cy="11" r="2" fill="#bf5af2" />
      <path d="M8 16.5C8 14.5 10 14 12 14C14 14 16 14.5 16 16.5V17H8V16.5Z" fill="#bf5af2" />
    </svg>
  ),
  Computer: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="11" rx="1.5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <path d="M9 19H15L14 15H10L9 19Z" fill="rgba(255,255,255,0.4)" />
      <line x1="7" y1="21" x2="17" y2="21" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  EmptyFolder: () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6C4 4.89543 4.89543 4 6 4H10L12 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 3"/>
    </svg>
  )
};

const FinderContent = memo(function FinderContent({ openApp, onClose, onMinimize, onMaximize }) {
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("macos");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { onTitleMouseDown } = useContext(WindowContext);
  const [tabs, setTabs] = useState([
    { id: 0, label: "Macintosh HD", folder: "macos" }
  ]);
  const [columnWidths] = useState({
    name: 300,
    size: 100,
    modified: 150
  });

  const handleContextMenu = (e, file) => {
    const items = [
      { label: "Open", action: () => openApplication(file.exec) },
      { label: "Open with...", action: () => console.log("Open with...") },
      { type: "divider" },
      { label: "Cut", action: () => console.log("Cut") },
      { label: "Copy", action: () => console.log("Copy") },
      { label: "Paste", action: () => console.log("Paste") },
      { type: "divider" },
      { label: "Move to Trash", action: () => console.log("Move to Trash") },
      { label: "Get Info", action: () => console.log("Get Info") },
    ];
    openContextMenu(e, items);
  };

  const getAppIcon = (appName) => {
    const app = APPS.find(a => a.name.toLowerCase() === appName.toLowerCase().replace('.app', ''));
    if (app) {
      return {
        type: "image",
        path: app.iconPath,
        fallback: app.id || "finder"
      };
    }
    return null;
  };

  const sidebar = {
    favourites: [
      { name: "AirDrop", action: "airdrop" },
      { name: "Recents", action: "recents" },
      { name: "Desktop", action: "desktop" },
      { name: "Documents", action: "documents" },
      { name: "Downloads", action: "downloads" },
      { name: "Applications", action: "applications" },
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

  // Файловая система
  const filesystem = {
    macos: [
      { name: "Applications", type: "folder", iconType: "folder", size: "--", modified: "Today", path: "/Applications" },
      { name: "Library", type: "folder", iconType: "folder", size: "--", modified: "Today", path: "/Library" },
      { name: "System", type: "folder", iconType: "system", size: "--", modified: "Yesterday", path: "/System" },
      { name: "Users", type: "folder", iconType: "users", size: "--", modified: "Today", path: "/Users" },
      { name: "README.md", type: "file", iconType: "code", size: "4.2 KB", modified: "Today", preview: "# hackintosh.web\n\nA web-native macOS experience built with React.\n\n## Features\n- Native-like macOS interface\n- Working Finder with file preview\n- Terminal emulator\n- Notes app" },
      { name: "LICENSE", type: "file", iconType: "file", size: "1.2 KB", modified: "Yesterday", preview: "MIT License\n\nCopyright (c) 2026 hackintosh.web..." },
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
      { name: "Macintosh HD", type: "alias", iconType: "drive", size: "--", modified: "Today", target: "macos" },
      { name: "hackintosh.web", type: "file", iconType: "code", size: "2 KB", modified: "Just now", preview: "macOS web simulation built with React" },
      { name: "Projects", type: "folder", iconType: "folder", size: "--", modified: "2 days ago", path: "projects" },
      { name: "README.md", type: "file", iconType: "code", size: "4.2 KB", modified: "Today", preview: "# hackintosh.web..." },
    ],
    documents: [
      { name: "Projects", type: "folder", iconType: "folder", size: "--", modified: "2 days ago", path: "projects" },
      { name: "Resume.pdf", type: "file", iconType: "file", size: "128 KB", modified: "Last week", preview: "Professional experience in full-stack development..." },
      { name: "Notes.txt", type: "file", iconType: "file", size: "2 KB", modified: "Yesterday", preview: "- Coffee\n- Matcha\n- More RAM" },
    ],
    downloads: [
      { name: "hackintosh-web.zip", type: "archive", iconType: "archive", size: "8.2 MB", modified: "Today", preview: "Archive contents..." },
      { name: "wallpaper.png", type: "image", iconType: "image", size: "3.1 MB", modified: "Yesterday", preview: "macOS default wallpaper" },
    ],
    projects: [
      { name: "hackintosh.web", type: "folder", iconType: "folder", size: "--", modified: "Just now", path: "hackintosh.web" },
      { name: "portfolio", type: "folder", iconType: "folder", size: "--", modified: "3 days ago", path: "portfolio" },
    ],
    "hackintosh.web": [
      { name: "src", type: "folder", iconType: "folder", size: "--", modified: "Just now", path: "src" },
      { name: "public", type: "folder", iconType: "folder", size: "--", modified: "Just now", path: "public" },
      { name: "package.json", type: "file", iconType: "code", size: "1.2 KB", modified: "Just now", preview: JSON.stringify({ name: "hackintosh.web", version: "1.0.0" }, null, 2) },
      { name: "README.md", type: "file", iconType: "code", size: "3.4 KB", modified: "Just now", preview: "# hackintosh.web" },
    ],
    portfolio: [
      { name: "index.html", type: "file", iconType: "code", size: "9 KB", modified: "3 days ago", preview: "<!DOCTYPE html>..." },
      { name: "style.css", type: "file", iconType: "code", size: "15 KB", modified: "3 days ago", preview: "body { margin: 0; }" },
    ],
    recents: [],
    network: [
      { name: "hackintosh.web.local", type: "computer", iconType: "computer", size: "--", modified: "Today" },
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
    if (openApp) openApp(appId);
  };

  const formatDate = (dateStr) => {
    if (dateStr === "Today") return new Date().toLocaleDateString();
    if (dateStr === "Yesterday") return new Date(Date.now() - 86400000).toLocaleDateString();
    if (dateStr === "Just now") return new Date().toLocaleTimeString();
    return dateStr;
  };

  // Метод рендеринга чистых SVG-иконок
  const renderIcon = (file, sizeOverride = null) => {
    if (file.isImageIcon && file.icon && file.icon.type === "image") {
      return (
        <AssetIcon
          path={file.icon.path}
          fallback="⚙️"
          size={sizeOverride || (isGridView ? 48 : 18)}
          alt={file.name}
          style={{ borderRadius: isGridView ? 10 : 4 }}
          imgStyle={{ objectFit: 'contain' }}
        />
      );
    }

    const sizeStyle = sizeOverride ? { width: sizeOverride, height: sizeOverride } : {};

    switch (file.iconType) {
      case "folder": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.Folder /></div>;
      case "system": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.System /></div>;
      case "users": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.Users /></div>;
      case "drive": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.Drive /></div>;
      case "archive": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.Archive /></div>;
      case "image": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.Image /></div>;
      case "code": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.CodeFile /></div>;
      case "computer": return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.Computer /></div>;
      default: return <div className="finder-svg-wrapper" style={sizeStyle}><FinderSVG.File /></div>;
    }
  };

  const addTab = () => {
    const newId = Date.now();
    setTabs(prev => [...prev, { id: newId, label: getFolderDisplayName(), folder: currentFolder }]);
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
          <div className="finder-traffic-lights" onMouseDown={(e) => !e.target.closest('.finder-traffic-light') && onTitleMouseDown(e)}>
            <button className="finder-traffic-light finder-traffic-light--close" onClick={onClose} title="Close" />
            <button className="finder-traffic-light finder-traffic-light--minimize" onClick={onMinimize} title="Minimize" />
            <button className="finder-traffic-light finder-traffic-light--maximize" onClick={onMaximize} title="Maximize" />
          </div>

          <div className="finder-sidebar-inner">
            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">Favourites</div>
              {sidebar.favourites.map(item => (
                <div key={item.name} className={`finder-sidebar-item ${currentFolder === item.action ? "active" : ""}`} onClick={() => navigateToFolder(item.name)}>
                  <span className="finder-sidebar-icon"><SidebarIcon name={item.action} /></span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">iCloud</div>
              {sidebar.icloud.map(item => (
                <div key={item.name} className={`finder-sidebar-item ${currentFolder === item.action ? "active" : ""}`} onClick={() => navigateToFolder(item.name)}>
                  <span className="finder-sidebar-icon"><SidebarIcon name={item.action} /></span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <div className="finder-sidebar-section">
              <div className="finder-sidebar-title">Locations</div>
              {sidebar.locations.map(item => (
                <div key={item.name} className={`finder-sidebar-item ${currentFolder === item.action ? "active" : ""}`} onClick={() => navigateToFolder(item.name)}>
                  <span className="finder-sidebar-icon"><SidebarIcon name={item.action} /></span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

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
          <div className="finder-toolbar" onMouseDown={(e) => !e.target.closest('button, input, .finder-tab, .finder-tab-add') && onTitleMouseDown(e)}>
            <div className="finder-toolbar-nav">
              <button className="finder-toolbar-button" onClick={() => navigateToFolder("macos")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button className="finder-toolbar-button" disabled>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div className="finder-toolbar-title">{getFolderDisplayName()}</div>

            <div className="finder-toolbar-actions">
              <div className="finder-view-controls">
                <button className={`finder-view-button ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                </button>
                <button className={`finder-view-button ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4zm9 0h7v7h-7zm0 9h7v7h-7zm-9 0h7v7H4z"/></svg>
                </button>
                <button className={`finder-view-button ${viewMode === "columns" ? "active" : ""}`} onClick={() => setViewMode("columns")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v16H4zm6 0h4v16h-4zm6 0h4v16h-4z"/></svg>
                </button>
              </div>
              <div className="finder-search-container">
                <input type="text" placeholder="Search" className="finder-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Нативные вкладки */}
          <div className="finder-tabs">
            {tabs.map(tab => (
              <div key={tab.id} className={`finder-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => switchTab(tab)}>
                <span className="finder-tab-label">{tab.label}</span>
                {tabs.length > 1 && (
                  <button className="finder-tab-close" onClick={(e) => closeTab(tab.id, e)}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            ))}
            <button className="finder-tab-add" onClick={addTab} title="New Tab">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>

          <div className="finder-file-area">
            <div className="finder-path-bar">
              <span className="finder-path-item">{getFolderDisplayName()}</span>
            </div>

            {!isGridView && !isColumnView && (
              <div className="finder-column-headers">
                <span className="finder-column-header" style={{ width: columnWidths.name }}>Name</span>
                <span className="finder-column-header" style={{ width: columnWidths.size }}>Size</span>
                <span className="finder-column-header" style={{ width: columnWidths.modified }}>Date Modified</span>
              </div>
            )}

            {/* Сетка */}
            {isGridView && (
              <div className="finder-grid-container">
                {currentFiles.length === 0 ? (
                  <div className="finder-empty-state">
                    <div className="finder-empty-icon"><FinderSVG.EmptyFolder /></div>
                    <span>This folder is empty.</span>
                  </div>
                ) : (
                  currentFiles.map(file => (
                    <div key={file.name} className={`finder-grid-item ${selectedFile === file.name ? "selected" : ""}`} onClick={() => setSelectedFile(file.name)} onDoubleClick={() => {
                      if (file.type === "folder") navigateToFolder(file.name, file.path);
                      else if (file.type === "app") openApplication(file.exec);
                    }}>
                      <div className="finder-grid-icon">{renderIcon(file)}</div>
                      <span className="finder-grid-name">{file.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Колонки */}
            {isColumnView && (
              <div className="finder-column-container">
                <div className="finder-column-list">
                  {currentFiles.map(file => (
                    <div key={file.name} className={`finder-column-item ${selectedFile === file.name ? "selected" : ""}`} onClick={() => setSelectedFile(file.name)} onDoubleClick={() => {
                      if (file.type === "folder") navigateToFolder(file.name, file.path);
                      else if (file.type === "app") openApplication(file.exec);
                    }}>
                      <span className="finder-column-item-icon">{renderIcon(file, 16)}</span>
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
                {selectedItem && (
                  <div className="finder-preview-column">
                    <div className="finder-preview-header">
                      <div className="finder-preview-icon">{renderIcon(selectedItem, 64)}</div>
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
                    {selectedItem.preview && <div className="finder-preview-content">{selectedItem.preview}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Список */}
            {!isGridView && !isColumnView && (
              <div className="finder-list-wrapper">
                <div className="finder-list-container">
                  {currentFiles.length === 0 ? (
                    <div className="finder-empty-state">
                      <div className="finder-empty-icon"><FinderSVG.EmptyFolder /></div>
                      <span>This folder is empty.</span>
                    </div>
                  ) : (
                    currentFiles.map(file => (
                      <div key={file.name} className={`finder-list-item ${selectedFile === file.name ? "selected" : ""}`} onClick={() => setSelectedFile(file.name)} onDoubleClick={() => {
                        if (file.type === "folder") navigateToFolder(file.name, file.path);
                        else if (file.type === "app") openApplication(file.exec);
                      }} onContextMenu={(e) => handleContextMenu(e, file)}>
                        <span className="finder-list-icon" style={{ width: columnWidths.name }}>
                          <span className="finder-list-icon-wrapper">{renderIcon(file)}</span>
                          <span className="finder-list-text-name">{file.name}</span>
                        </span>
                        <span className="finder-list-size" style={{ width: columnWidths.size }}>{file.size}</span>
                        <span className="finder-list-modified" style={{ width: columnWidths.modified }}>{formatDate(file.modified)}</span>
                      </div>
                    ))
                  )}
                </div>

                {selectedItem && (
                  <div className="finder-preview-panel">
                    <div className="finder-preview-header">
                      <div className="finder-preview-icon">{renderIcon(selectedItem, 64)}</div>
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
                    {selectedItem.preview && <div className="finder-preview-content">{selectedItem.preview}</div>}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="finder-status-bar">
            {currentFiles.length} item{currentFiles.length !== 1 ? "s" : ""}
            {selectedFile && ` • ${selectedFile} selected`}
          </div>
        </div>

        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={closeContextMenu} />
        )}
      </div>
    </div>
  );
});

export default FinderContent;