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
            `Author: ${author.name || "Unknown"}`,
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
      // Получаем динамические значения
      const resolution = `${window.innerWidth}x${window.innerHeight}`;
      const uptime = Math.floor(performance.now() / 1000);
      const memory = (performance?.memory?.usedJSHeapSize 
        ? Math.round(performance.memory.usedJSHeapSize / 1048576) 
        : 128) + " MB";

      const neofetchLines = [
        "",
        " \x1b[38;5;39m                                     ,\x1b[0m                          \x1b[32mgaminghackintosh\x1b[0m@\x1b[36mhackintosh.web\x1b[0m",
        " \x1b[38;5;39m                                    ;o\\\\\x1b[0m                         ─────────────────────────────",
        " \x1b[38;5;45m                                    ;Ob`.\x1b[0m                       OS:          \x1b[37mhackintosh.web 1.0.0\x1b[0m",
        " \x1b[38;5;45m                                   ;OOOOb`.\x1b[0m                     Kernel:      \x1b[37mhackintosh-core\x1b[0m",
        " \x1b[38;5;51m                                  ;OOOOOY\" )\x1b[0m                    Host:        \x1b[37mMacBook Pro (Simulated)\x1b[0m",
        " \x1b[38;5;51m                                 ;OOOO' ,%%)\x1b[0m                    Shell:       \x1b[37mhacksh 1.0.0\x1b[0m",
        " \x1b[38;5;87m                             \\\\  /OOO ,%%%%,%\\\\\x1b[0m                 Runtime:     \x1b[37mReact 18 / V8\x1b[0m",
        " \x1b[38;5;87m                              |:  ,%%%%%%;%%/\x1b[0m                  Resolution:  \x1b[37m" + resolution + "\x1b[0m",
        " \x1b[38;5;123m                              ||,%%%%%%%%%%/\x1b[0m                   Theme:       \x1b[35mhackintosh Dark\x1b[0m",
        " \x1b[38;5;123m                              ;|%%%%%%%%%'/`-\"\"`.\x1b[0m             Engine:      \x1b[37mChromium Terminal\x1b[0m",
        " \x1b[38;5;159m                             /: %%%%%%%%'/ c$$$$.`.\x1b[0m            Memory:      \x1b[37m" + memory + "\x1b[0m",
        " \x1b[38;5;159m                `.______     \\\\ \\\\%%%%%%%'/.$$YF\"Y$: )\x1b[0m          Uptime:      \x1b[37m" + uptime + "s\x1b[0m",
        " \x1b[38;5;195m              _________ \"`..\\\\`o \\\\`%%' ,',$F,.   $F )\x1b[0m         Packages:    \x1b[37m1337 (npm)\x1b[0m",
        " \x1b[38;5;195m     ___,--\"\"'dOOO;,:%%`-._ o_,O_   ,'\"',d88)  '  )\x1b[0m",
        " \x1b[38;5;45m  -\"'. YOOOOOOO';%%%%%%%%%;`-O   )_     ,X888F   _/\x1b[0m",
        " \x1b[38;5;45m      \\\\ YOOOO',%%%%%%%%%%Y    \\\\__;`),-.  `\"\"F  ,'\x1b[0m",
        " \x1b[38;5;51m       \\\\ `\" ,%%%%%%%%%%,' _,-   \\\\-' \\\\_ `------'\x1b[0m",
        " \x1b[38;5;51m        \\\\_ %%%%',%%%%%_,-' ,;    ( _,-\\\\\x1b[0m",
        " \x1b[38;5;87m          `-.__`%%',-' .c$$'     |\\\\-_,-\\\\\x1b[0m",
        " \x1b[38;5;87m               `\"\"; ,$$$',md8oY  : `\\\\_,')\x1b[0m",
        " \x1b[38;5;123m                 ( ,$$$F `88888  ;   `--'\x1b[0m",
        " \x1b[38;5;123m                  \\\\`$$(    `\"\"' /\x1b[0m",
        " \x1b[38;5;159m                   \\\\`\"$$c'   _,'\x1b[0m",
        " \x1b[38;5;159m                    `.____,-'\x1b[0m",
        "",
        " \x1b[40m   \x1b[0m\x1b[41m   \x1b[0m\x1b[42m   \x1b[0m\x1b[43m   \x1b[0m\x1b[44m   \x1b[0m\x1b[45m   \x1b[0m\x1b[46m   \x1b[0m\x1b[47m   \x1b[0m",
        "",
      ];

      return { clear: false, lines: neofetchLines };
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

// Безопасный парсинг ANSI-цветов без dangerouslySetInnerHTML
const renderLine = (text) => {
  // Карта ANSI-кодов → цвет CSS
  const ansiColorMap = {
    '31': '#ff5f56', // red
    '32': '#27c93f', // green
    '33': '#ffbd2e', // yellow
    '34': '#0a84ff', // blue
    '35': '#bf5af2', // purple
    '36': '#5ac8fa', // cyan
    '37': '#f2f2f7', // white
    '0': undefined,   // reset – вернёмся к дефолтному цвету
  };

  const ansiEscape = '\x1b';
  const segments = [];
  let currentColor = undefined;
  let buffer = '';

  for (let i = 0; i < text.length; i++) {
    if (text[i] === ansiEscape && text[i + 1] === '[') {
      // Нашли начало ANSI-последовательности
      const endIdx = text.indexOf('m', i + 2);
      if (endIdx === -1) {
        // Некорректная последовательность – добавим как текст
        buffer += text[i];
        continue;
      }

      // Сохраняем накопленный текст с текущим цветом
      if (buffer.length > 0) {
        segments.push({ text: buffer, color: currentColor });
        buffer = '';
      }

      const code = text.slice(i + 2, endIdx); // например, '31'
      currentColor = ansiColorMap[code] !== undefined ? ansiColorMap[code] : currentColor;

      i = endIdx; // перемещаемся к 'm'
      continue;
    }

    buffer += text[i];
  }

  // Добавляем остаток
  if (buffer.length > 0) {
    segments.push({ text: buffer, color: currentColor });
  }

  // Ограничение по длине ввода
  if (input.length > 2000) return;


  return (
    <span style={{ whiteSpace: 'pre' }}>
      {segments.map((seg, idx) => (
        <span
          key={idx}
          style={seg.color ? { color: seg.color } : {}}
          // React автоматически экранирует HTML-теги внутри текста
        >
          {seg.text}
        </span>
      ))}
    </span>
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