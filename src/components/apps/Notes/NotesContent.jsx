import React, { useState } from "react";

export function NotesContent() {
  const initialNotes = [
    {
      id: 1,
      title: "Developer Life Plan",
      content:
        "# Roadmap 🚀\n\n✔ Learn React\n✔ Understand useEffect (sometimes)\n✔ Stop breaking layouts by 2px\n✔ Build something that looks like Apple UI\n\n🔲 Become rich\n🔲 Sleep 8 hours (optional feature)\n🔲 Stop using console.log as a debugger framework",
      modified: "Just now",
    },
    {
      id: 2,
      title: "Debugging Thoughts",
      content:
        "useEffect(() => {\n  // why is this running 17 times?\n  // I didn't change anything\n  // it just started working differently\n}, [])\n\n// 2 hours later:\n// turns out I did change everything",
      modified: "Yesterday",
    },
    {
      id: 3,
      title: "Essential Survival Kit",
      content:
        "- Coffee ☕\n- More coffee ☕☕\n- Motivation (not found)\n- npm install --force\n- Hope\n- 1% battery and blind confidence",
      modified: "2 days ago",
    },
    {
      id: 4,
      title: "JavaScript Summary",
      content:
        "let life = undefined;\n\nsetTimeout(() => {\n  life = null;\n}, 0);\n\nconsole.log(life);\n\n// expected: meaning\n// actual: undefined",
      modified: "Today",
    },
    {
      id: 5,
      title: "Developer Philosophy",
      content:
        "If it works — don't touch it.\n\nIf it doesn't work — you didn't touch anything.\n\nIf everything breaks — it's webpack's fault.",
      modified: "Today",
    },
    {
      id: 6,
      title: "Git Commit Reality",
      content:
        "feat: added feature\nfix: fixed feature\nchore: touched something I don't understand\nrefactor: moved code around and prayed\n\n// everything works until you push to production",
      modified: "Today",
    },
  ];

  const [notes, setNotes] = useState(initialNotes);
  const [activeId, setActiveId] = useState(1);

  const activeNote = notes.find((n) => n.id === activeId);

  const updateContent = (content) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId
          ? { ...n, content, modified: "Just now" }
          : n
      )
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          flexShrink: 0,
          background: "rgba(36,36,40,0.96)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 14px 8px",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 0.8,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          ALL NOTES — {notes.length}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveId(note.id)}
              style={{
                padding: "10px 14px",
                background:
                  activeId === note.id
                    ? "rgba(255,190,0,0.16)"
                    : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                cursor: "pointer",
                borderLeft:
                  activeId === note.id
                    ? "3px solid #ffd60a"
                    : "3px solid transparent",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: 3,
                }}
              >
                {note.title}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                {note.modified}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={activeNote?.content || ""}
        onChange={(e) => updateContent(e.target.value)}
        placeholder="Start writing..."
        style={{
          flex: 1,
          background: "rgba(22,22,26,0.99)",
          border: "none",
          outline: "none",
          color: "rgba(255,255,255,0.85)",
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 14,
          lineHeight: 1.75,
          padding: "22px 28px",
          resize: "none",
        }}
      />
    </div>
  );
}