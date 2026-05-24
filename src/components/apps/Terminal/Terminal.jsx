import React, { useState, useEffect, useRef } from "react";

/* ===== Terminal ===== */
export function TerminalContent() {
  const [history, setHistory] = useState([
    { type: "output", text: "Last login: " + new Date().toDateString() + " on ttys001" },
    { type: "output", text: "" },
    { type: "output", text: 'Type "help" for available commands.' },
    { type: "output", text: "" },
  ]);

  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);

  const [gitLogLines, setGitLogLines] = useState([]);
  const [gitLogLoading, setGitLogLoading] = useState(true);
  const [gitLogError, setGitLogError] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGitLog() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/gaminghackintosh/hackintosh.web/commits?sha=code-root&per_page=10",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const commits = await response.json();

        const lines = commits.flatMap((commit) => {
          const author = commit.commit.author || {};
          const date = author.date ? new Date(author.date) : new Date();
          const message = commit.commit.message?.split("\n")[0] || "(no commit message)";

          return [
            `\x1b[33mcommit ${commit.sha.slice(0, 7)}\x1b[0m`,
            `Author: ${author.name || "Unknown"} <${author.email || "noreply@github.com"}>`,
            `Date:   ${date.toUTCString()}`,
            "",
            `    ${ message}`,
            "",
          ];
        });

        setGitLogLines(lines.length ? lines : ["No commits found."]);
      } catch (error) {
        if (error.name !== "AbortError") {
          setGitLogError(error.message);
          setGitLogLines([]);
        }
      } finally {
        setGitLogLoading(false);
      }
    }

    fetchGitLog();
    return () => controller.abort();
  }, []);

  const runCommand = (raw) => {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    const joinArgs = args.join(" ");

    // ===== HELP =====
    if (cmd === "help") {
      return {
        clear: false,
        lines: [
          "Available commands:",
          "  ls        – list directory contents",
          "  pwd       – print working directory",
          "  whoami    – current user",
          "  uname     – system information",
          "  date      – current date & time",
          "  echo      – print text",
          "  cat       – print file contents",
          "  neofetch  – system info with ASCII art",
          "  clear     – clear the terminal",
          "  open      – open an app",
          "  git log   – repository commit history",
        ],
      };
    }

    // ===== BASIC COMMANDS =====
    if (cmd === "ls") {
      return {
        clear: false,
        lines: [
          "Desktop/    Documents/    Downloads/    Movies/    Music/",
          "Pictures/   Projects/     Public/       readme.md",
        ],
      };
    }

    if (cmd === "pwd") return { clear: false, lines: ["/Users/gaminghackintosh"] };

    if (cmd === "whoami") return { clear: false, lines: ["gaminghackintosh"] };

    if (cmd === "uname") {
      return {
        clear: false,
        lines: [
          "Darwin hackintosh.web 24.0.0 Darwin Kernel Version 24.0.0; root:xnu/RELEASE_ARM64",
        ],
      };
    }

    if (cmd === "date") {
      return { clear: false, lines: [new Date().toString()] };
    }

    if (cmd === "echo") {
      return { clear: false, lines: [joinArgs || ""] };
    }

    if (cmd === "open") {
      return { clear: false, lines: [`Opening ${joinArgs || "application"}...`] };
    }

    if (cmd === "cat" && joinArgs === "readme.md") {
      return {
        clear: false,
        lines: [
          "# hackintosh.web",
          "",
          "A web-native macOS experience built with React.",
          "",
          "## Features",
          "- Draggable windows",
          "- Dock with magnification",
          "- Finder, Terminal, Notes",
          "- Live clock and menu bar",
        ],
      };
    }

    // ===== GIT LOG (FIXED) =====
    if (cmd === "git" && args[0] === "log") {
      if (gitLogLoading) {
        return { clear: false, lines: ["Fetching commit history from GitHub..."] };
      }

      if (gitLogError) {
        return { clear: false, lines: [`\x1b[31merror:\x1b[0m ${gitLogError}`] };
      }

      return {
        clear: false,
        lines: gitLogLines.length ? gitLogLines : ["No commit history available."],
      };
    }

    if (cmd === "neofetch") {
      return {
        clear: false,
        lines: [
          "",
          "gaminghackintosh@hackintosh.web",
          "OS: hackintosh.web 1.0.0",
          "Shell: hacksh 1.0.0",
          "Runtime: React 18",
          `Resolution: ${window.innerWidth}x${window.innerHeight}`,
          `Uptime: ${Math.floor(performance.now() / 1000)}s`,
        ],
      };
    }

    if (cmd === "clear") {
      return { clear: true, lines: [] };
    }

    // ===== FALLBACK =====
    return {
      clear: false,
      lines: [
        `\x1b[31m${cmd}: command not found\x1b[0m. Type 'help' for available commands.`,
      ],
    };
  };

  const handleSubmit = () => {
    const cmd = input.trim();
    if (!cmd) return;

    const result = runCommand(cmd);

    if (result.clear) {
      setHistory([{ type: "output", text: "" }]);
    } else {
      setHistory((prev) => [
        ...prev,
        { type: "prompt", text: cmd },
        ...result.lines.map((t) => ({ type: "output", text: t })),
      ]);
    }

    setCmdHistory((prev) => [cmd, ...prev]);
    setCmdIdx(-1);
    setInput("");
  };

  const renderLine = (text) => {
    const ansiMap = {
      "\x1b[0m": "</span>",
      "\x1b[31m": '<span style="color:#ff5f56">',
      "\x1b[32m": '<span style="color:#27c93f">',
      "\x1b[33m": '<span style="color:#ffbd2e">',
      "\x1b[34m": '<span style="color:#0a84ff">',
      "\x1b[35m": '<span style="color:#bf5af2">',
      "\x1b[36m": '<span style="color:#5ac8fa">',
      "\x1b[37m": '<span style="color:#f2f2f7">',
    };

    let result = text;
    Object.entries(ansiMap).forEach(([code, tag]) => {
      result = result.split(code).join(tag);
    });

    return (
      <span
        dangerouslySetInnerHTML={{ __html: result }}
        style={{ whiteSpace: "pre" }}
      />
    );
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "rgba(16,16,18,0.99)",
        height: "100%",
        fontFamily:
          '"SF Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
        fontSize: 13,
        color: "#d4d4d4",
        overflowY: "auto",
        cursor: "text",
        display: "flex",
        flexDirection: "column",
        padding: "12px 14px",
      }}
    >
      <div style={{ flex: 1 }}>
        {history.map((entry, i) => (
          <div key={i} style={{ lineHeight: 1.65 }}>
            {entry.type === "prompt" ? (
              <span>
                <span style={{ color: "#32d74b" }}>gaminghackintosh</span>
                <span style={{ color: "#48484a" }}>@</span>
                <span style={{ color: "#0a84ff" }}>hackintosh.web</span>
                <span style={{ color: "#636366" }}>:~$ </span>
                <span>{entry.text}</span>
              </span>
            ) : (
              renderLine(entry.text)
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 6, gap: 6 }}>
        <span style={{ color: "#32d74b" }}>gaminghackintosh@hackintosh.web:~$ </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();

            if (e.key === "ArrowUp") {
              const ni = Math.min(cmdIdx + 1, cmdHistory.length - 1);
              setCmdIdx(ni);
              setInput(cmdHistory[ni] || "");
            }

            if (e.key === "ArrowDown") {
              const ni = Math.max(cmdIdx - 1, -1);
              setCmdIdx(ni);
              setInput(ni === -1 ? "" : cmdHistory[ni]);
            }
          }}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#f2f2f7",
            flex: 1,
            fontFamily: "inherit",
            fontSize: "inherit",
            caretColor: "#f2f2f7",
          }}
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
}