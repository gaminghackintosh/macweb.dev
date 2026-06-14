import React, { useState, useEffect, useRef, useContext } from "react";
import { WindowContext } from "@/windows";
import { VscTerminalBash } from "react-icons/vsc";

// Массив для команды fortune
const FORTUNES = [
  "The best way to predict the future is to invent it.",
  "When in doubt, use brute force.",
  "Start small, think big.",
  "The code is not the problem. The comment is.",
  "sudo make me a sandwich.",
  "git commit -m 'Fixed everything'",
  "The only thing constant in life is change... and bugs.",
];

// Генерация случайной строки для "matrix"
const randomMatrixString = (length = 20) => {
  const chars = "01アイウエオカキクケコサシスセソタチツテト";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export function TerminalContent({ openApp }) {
  const { onClose, onMinimize, onZoom, onTitleMouseDown } = useContext(WindowContext);

  const [history, setHistory] = useState([
    { type: "output", text: `\x1b[33mLast login:\x1b[0m ${new Date().toDateString()} on ttys001` },
    { type: "output", text: "" },
    { type: "output", text: '\x1b[32mWelcome to macweb.dev terminal!\x1b[0m' },
    { type: "output", text: 'Type "help" for available commands.' },
    { type: "output", text: "" },
  ]);

  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const [matrixInterval, setMatrixInterval] = useState(null);

  const [gitLogLines, setGitLogLines] = useState([]);
  const [gitLogLoading, setGitLogLoading] = useState(true);
  const [gitLogError, setGitLogError] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Авто-скролл
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Fetch Git log
  useEffect(() => {
    const controller = new AbortController();
    async function fetchGitLog() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/gaminghackintosh/macweb.dev/commits?sha=code-root&per_page=10",
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
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
            `    ${message}`,
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

  // ─── ХЕЛПЕРЫ ДЛЯ КОМАНД ──────────────────────────────────────────

  const openAppHelper = (appName) => {
    const appMap = {
      finder: "finder",
      settings: "settings",
      notes: "notes",
      terminal: "terminal",
      music: "music",
      safari: "safari",
    };
    const appId = appMap[appName.toLowerCase()];
    if (appId && openApp) {
      openApp(appId);
      return `Opening ${appName}...`;
    } else {
      return `\x1b[31mError:\x1b[0m Application '${appName}' not found.`;
    }
  };

  // ─── ОСНОВНАЯ ФУНКЦИЯ ОБРАБОТКИ КОМАНД ──────────────────────────

  const runCommand = (raw) => {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const joinArgs = args.join(" ");

    // === HELP ===
    if (cmd === "help") {
      return {
        clear: false,
        lines: [
          "\x1b[36mAvailable commands:\x1b[0m",
          "  ls          – list directory contents",
          "  pwd         – print working directory",
          "  whoami      – current user",
          "  uname       – system information",
          "  date        – current date & time",
          "  echo        – print text",
          "  cat         – print file contents",
          "  neofetch    – system info with ASCII art",
          "  clear       – clear the terminal",
          "  open <app>  – open an application (e.g., open finder)",
          "  git log     – repository commit history",
          "  history     – show command history",
          "  fortune     – show a random quote",
          "  cowsay      – display a cow saying something",
          "  matrix      – matrix rain effect (ctrl+c to stop)",
          "  weather     – show weather forecast (mock)",
          "  hi          – say hello",
          "  figlet <text> – display ASCII art text",
          "  sl          – display a steam locomotive animation",
          "  tree        – display directory tree",
          "  ping <host> – ping a host (mock)",
          "  wget <url>  – download a file (mock)",
          "  curl <url>  – fetch a URL (mock)",
          "  top         – display process list (mock)",
          "  df          – display disk space",
          "  du          – display disk usage",
          "  uname -a    – display all system info",
          "  who         – display logged-in users",
        ],
      };
    }

    // === FILESYSTEM COMMANDS ===
    if (cmd === "ls") {
      return {
        clear: false,
        lines: [
          "Desktop    Documents  Downloads  Movies",
          "Music      Pictures   Projects   Public",
          "readme.md  .git       .config    .local",
        ],
      };
    }

    if (cmd === "pwd") return { clear: false, lines: ["/Users/gaminghackintosh"] };
    if (cmd === "whoami") return { clear: false, lines: ["gaminghackintosh"] };

    if (cmd === "uname") {
      if (args[0] === "-a") {
        return { clear: false, lines: ["Darwin macweb.dev 24.0.0 Darwin Kernel Version 24.0.0; root:xnu/RELEASE_ARM64 macweb.dev"] };
      }
      return { clear: false, lines: ["Darwin"] };
    }

    if (cmd === "date") return { clear: false, lines: [new Date().toString()] };
    if (cmd === "echo") return { clear: false, lines: [joinArgs || ""] };

    if (cmd === "cat" && joinArgs === "readme.md") {
      return {
        clear: false,
        lines: [
          "# macweb.dev",
          "",
          "A web-native macOS experience built with React.",
          "",
          "## Features",
          "- Draggable windows with glassmorphism",
          "- Dock with magnification",
          "- Finder, Terminal, Notes, Music, Settings",
          "- Live clock and menu bar",
        ],
      };
    }

    if (cmd === "cat" && joinArgs === ".git/config") {
      return {
        clear: false,
        lines: [
          "[core]",
          "  repositoryformatversion = 0",
          "  filemode = true",
          "  bare = false",
          "  logallrefupdates = true",
          "[remote \"origin\"]",
          "  url = https://github.com/gaminghackintosh/macweb.dev.git",
          "  fetch = +refs/heads/*:refs/remotes/origin/*",
        ],
      };
    }

    if (cmd === "cat") {
      return { clear: false, lines: [`\x1b[31mcat: ${joinArgs}: No such file or directory\x1b[0m`] };
    }

    // === GIT ===
    if (cmd === "git" && args[0] === "log") {
      if (gitLogLoading) return { clear: false, lines: ["\x1b[33mFetching commit history from GitHub...\x1b[0m"] };
      if (gitLogError) return { clear: false, lines: [`\x1b[31merror:\x1b[0m ${gitLogError}`] };
      return { clear: false, lines: gitLogLines.length ? gitLogLines : ["No commit history available."] };
    }

    // === NEOFETCH (ПОЛНЫЙ) ===
    if (cmd === "neofetch") {
      const resolution = `${window.innerWidth}x${window.innerHeight}`;
      const uptime = Math.floor(performance.now() / 1000);
      const memory = (performance?.memory?.usedJSHeapSize 
        ? Math.round(performance.memory.usedJSHeapSize / 1048576) 
        : 128) + " MB";

      return {
        clear: false,
        lines: [
          "",
          " \x1b[38;5;39m                                     ,\x1b[0m                          \x1b[32mgaminghackintosh\x1b[0m@\x1b[36mmacweb.dev\x1b[0m",
          " \x1b[38;5;39m                                    ;o\\\\\x1b[0m                         ─────────────────────────────",
          " \x1b[38;5;45m                                    ;Ob`.\x1b[0m                       OS:          \x1b[37mmacweb.dev 1.0.0\x1b[0m",
          " \x1b[38;5;45m                                   ;OOOOb`.\x1b[0m                     Kernel:      \x1b[37mmacweb-core\x1b[0m",
          " \x1b[38;5;51m                                  ;OOOOOY\" )\x1b[0m                    Host:        \x1b[37mMacBook Pro (Simulated)\x1b[0m",
          " \x1b[38;5;51m                                 ;OOOO' ,%%)\x1b[0m                    Shell:       \x1b[37mhacksh 1.0.0\x1b[0m",
          " \x1b[38;5;87m                             \\\\  /OOO ,%%%%,%\\\\\x1b[0m                 Runtime:     \x1b[37mReact 19 / V8\x1b[0m",
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
        ],
      };
    }

    // === NEW INTERACTIVE COMMANDS ===
    if (cmd === "open") {
      if (!args[0]) return { clear: false, lines: ["\x1b[31mError:\x1b[0m Usage: open <app_name>"] };
      return { clear: false, lines: [openAppHelper(args[0])] };
    }

    if (cmd === "history") {
      if (cmdHistory.length === 0) return { clear: false, lines: ["No command history."] };
      return {
        clear: false,
        lines: cmdHistory.map((c, i) => `  ${cmdHistory.length - i}  ${c}`),
      };
    }

    if (cmd === "fortune") {
      return { clear: false, lines: [`\x1b[35m${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}\x1b[0m`] };
    }

    if (cmd === "cowsay") {
      const text = joinArgs || "Moo!";
      const maxLength = 40;
      const formatted = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
      return {
        clear: false,
        lines: [
          ` ${'_'.repeat(formatted.length + 2)}`,
          `< ${formatted} >`,
          ` ${'-'.repeat(formatted.length + 2)}`,
          "        \\   ^__^",
          "         \\  (oo)\\_______",
          "            (__)\\       )\\/\\",
          "                ||----w |",
          "                ||     ||",
        ],
      };
    }

    if (cmd === "matrix") {
      if (matrixInterval) {
        clearInterval(matrixInterval);
        setMatrixInterval(null);
        return { clear: false, lines: ["\x1b[31mMatrix effect stopped.\x1b[0m"] };
      }
      const id = setInterval(() => {
        setHistory(prev => [...prev, { type: "output", text: `\x1b[32m${randomMatrixString()}\x1b[0m` }]);
      }, 150);
      setMatrixInterval(id);
      return { clear: false, lines: ["\x1b[32mMatrix rain started. (Type 'matrix' again to stop)\x1b[0m"] };
    }

    if (cmd === "weather") {
      return { clear: false, lines: [
        `\x1b[36mWeather for macweb.dev:\x1b[0m`,
        `  ☀️  Temperature: 24°C`,
        `  🌬️  Wind: 12 km/h`,
        `  💧  Humidity: 45%`,
      ]};
    }

    if (cmd === "hi") {
      return { clear: false, lines: ["\x1b[33mHello! Welcome to the macweb.dev terminal! 🍏\x1b[0m"] };
    }

    // === FUN ASCII ART ===
    if (cmd === "figlet") {
      const text = joinArgs || "Hello";
      const frames = [
        "'     ('-. .-.   ('-.                                          (` .-') /`             _  .-')            _ .-') _   ",
        "'    ( OO )  / _(  OO)                                          \\`.( OO ),'            ( \\\\( -O )          ( (  OO) )  ",
        "'    ,--. ,--.(,------.,--.      ,--.      .-'),-----.       ,--./  .--.   .-'),-----. ,------.  ,--.     \\\\     .'_  ",
        "'    |  | |  | |  .---'|  |.-')  |  |.-') ( OO'  .-.  '      |      |  |  ( OO'  .-.  '|   /\\\\\\. ' |  |.-') ,\\\\`'--..._) ",
        "'    |   .|  | |  |    |  | OO ) |  | OO )/   |  | |  |      |  |   |  |, /   |  | |  ||  /  | | |  | OO )|  |  \\\\  ' ",
        "'    |       |(|  '--. |  |\\\\`-' | |  |\\\\`-' |\\\\_) |  |\\\\|  |      |  |.'.|  |_)\\\\_) |  |\\\\|  ||  |_.' | |  |\\\\`-' ||  |   ' | ",
        "'    |  .-.  | |  .--'(|  '---.'(|  '---.'  \\\\ |  | |  |      |         |    \\\\ |  | |  ||  .  '.'(|  '---.'|  |   / : ",
        "'    |  | |  | |  \\\\`---.|      |  |      |    \\\\`'  '-'  '      |   ,'.   |     \\\\`'  '-'  '|  |\\\\  \\\\  |      | |  '--'  / ",
        "'    \\\\`--' \\\\`--' \\\\`------'\\\\`------'  \\\\`------'      \\\\`-----'       '--'   '--'       \\\\`-----' \\\\`--' '--' \\\\`------' \\\\`-------'  ",
      ];
      return { clear: false, lines: frames };
    }

    if (cmd === "sl") {
      const frames = [
        "    ___________       ",
        "   /   |   |   \\      ",
        "  /    |   |    \\     ",
        " /     |   |     \\    ",
        "/______|___|______\\   ",
        "|      |   |      |   ",
        "|      |   |      |   ",
        "|______|___|______|   ",
        "   \\______________/   ",
      ];
      return { clear: false, lines: frames };
    }

    if (cmd === "tree") {
      return {
        clear: false,
        lines: [
          ".",
          "├── Desktop",
          "├── Documents",
          "│   ├── Projects",
          "│   └── Resume.pdf",
          "├── Downloads",
          "├── Music",
          "├── Pictures",
          "├── Projects",
          "│   ├── macweb.dev",
          "│   └── portfolio",
          "└── Public",
        ],
      };
    }

    // === NETWORK COMMANDS ===
    if (cmd === "ping") {
      const host = args[0] || "localhost";
      return {
        clear: false,
        lines: [
          `PING ${host} (127.0.0.1): 56 data bytes`,
          `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.123 ms`,
          `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045 ms`,
          `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.089 ms`,
          `--- ${host} ping statistics ---`,
          `3 packets transmitted, 3 packets received, 0% packet loss`,
        ],
      };
    }

    if (cmd === "wget") {
      const url = args[0] || "https://example.com";
      return {
        clear: false,
        lines: [
          `--2025-01-01 12:00:00--  ${url}`,
          `Resolving ${new URL(url).hostname}... 93.184.216.34`,
          `Connecting to ${new URL(url).hostname}:443... connected.`,
          `HTTP request sent, awaiting response... 200 OK`,
          `Length: 12345 (12K) [text/html]`,
          `Saving to: 'index.html'`,
          `index.html 100%[===================>]  12.34K  --.-KB/s`,
          `2025-01-01 12:00:01 (12.3 MB/s) - 'index.html' saved [12345/12345]`,
        ],
      };
    }

    if (cmd === "curl") {
      const url = args[0] || "https://api.github.com";
      return {
        clear: false,
        lines: [
          `*   Trying 140.82.121.6:443...`,
          `* Connected to api.github.com (140.82.121.6) port 443`,
          `* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384`,
          `> GET / HTTP/1.1`,
          `> Host: api.github.com`,
          `> User-Agent: curl/8.5.0`,
          `> Accept: */*`,
          `>`,
          `< HTTP/1.1 200 OK`,
          `< Server: GitHub API`,
          `< Content-Type: application/json; charset=utf-8`,
          `< Content-Length: 12345`,
          `* Connection #0 to host api.github.com left intact`,
        ],
      };
    }

    // === SYSTEM INFO COMMANDS ===
    if (cmd === "top") {
      const now = new Date().toLocaleTimeString();
      return {
        clear: false,
        lines: [
          `Processes: 42 total, 2 running, 40 sleeping, 0 zombie`,
          `CPU: 12% user, 8% sys, 80% idle`,
          `Memory: 16 GB total, 8.2 GB used, 7.8 GB free`,
          `Networks: 5 packets in, 3 packets out`,
          ``,
          `PID  COMMAND      %CPU  TIME     MEM  USER`,
          `1234 hacksh      0.0   0:00.01  12M  gaminghackintosh`,
          `5678 node        0.8   0:12.34  256M gaminghackintosh`,
          `9012 react       0.2   0:04.56  128M gaminghackintosh`,
        ],
      };
    }

    if (cmd === "df") {
      return {
        clear: false,
        lines: [
          `Filesystem     1K-blocks    Used Available Use% Mounted on`,
          `/dev/disk1s1   102400000 20480000  81920000  25% /`,
          `/dev/disk1s2   102400000 10240000  92160000  10% /home`,
          `tmpfs          16384000    204800  16179200   2% /tmp`,
        ],
      };
    }

    if (cmd === "du") {
      return {
        clear: false,
        lines: [
          `12K    ./Projects/macweb.dev/src`,
          `8K     ./Projects/macweb.dev/public`,
          `4K     ./Projects/macweb.dev/assets`,
          `24K    ./Projects/macweb.dev`,
          `16K    ./Documents/Projects`,
          `8K     ./Downloads`,
          `4K     ./Music`,
        ],
      };
    }

    if (cmd === "who") {
      return {
        clear: false,
        lines: [
          `gaminghackintosh   tty1         2025-01-01 12:00`,
          `gaminghackintosh   tty2         2025-01-01 13:30`,
        ],
      };
    }

    if (cmd === "clear") {
      if (matrixInterval) {
        clearInterval(matrixInterval);
        setMatrixInterval(null);
      }
      return { clear: true, lines: [] };
    }

    return {
      clear: false,
      lines: [`\x1b[31m${cmd}: command not found\x1b[0m. Type 'help' for available commands.`],
    };
  };

  // ─── ОТПРАВКА КОМАНДЫ ──────────────────────────────────────────────

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

  // ─── ANSI ПАРСЕР ────────────────────────────────────────────────────

  const renderLine = (text) => {
    const ansiColorMap = {
      '31': '#ff5f56', // red
      '32': '#27c93f', // green
      '33': '#ffbd2e', // yellow
      '34': '#0a84ff', // blue
      '35': '#bf5af2', // purple
      '36': '#5ac8fa', // cyan
      '37': '#f2f2f7', // white
      '0': undefined,
    };

    const ansiEscape = '\x1b';
    const segments = [];
    let currentColor = undefined;
    let buffer = '';

    for (let i = 0; i < text.length; i++) {
      if (text[i] === ansiEscape && text[i + 1] === '[') {
        const endIdx = text.indexOf('m', i + 2);
        if (endIdx === -1) {
          buffer += text[i];
          continue;
        }

        if (buffer.length > 0) {
          segments.push({ text: buffer, color: currentColor });
          buffer = '';
        }

        const code = text.slice(i + 2, endIdx); 
        currentColor = ansiColorMap[code] !== undefined ? ansiColorMap[code] : currentColor;

        i = endIdx;
        continue;
      }
      buffer += text[i];
    }

    if (buffer.length > 0) {
      segments.push({ text: buffer, color: currentColor });
    }

    return (
      <span style={{ whiteSpace: 'pre' }}>
        {segments.map((seg, idx) => (
          <span key={idx} style={seg.color ? { color: seg.color } : {}}>
            {seg.text}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="terminal-container">
      {/* Шапка окна macOS */}
      <div className="terminal-window-header" onMouseDown={(e) => !e.target.closest('.terminal-btn') && onTitleMouseDown(e)}>
        <div className="terminal-traffic-lights">
          <button className="terminal-btn terminal-btn--close" onClick={onClose} />
          <button className="terminal-btn terminal-btn--minimize" onClick={onMinimize} />
          <button className="terminal-btn terminal-btn--zoom" onClick={onZoom} />
        </div>
        <div className="terminal-window-title">
          <VscTerminalBash className="terminal-header-icon" />
          <span>gaminghackintosh — hacksh — 80×24</span>
        </div>
      </div>

      {/* Тело терминала */}
      <div className="terminal-window-body" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-history-area">
          {history.map((entry, i) => (
            <div key={i} className="terminal-output-line">
              {entry.type === "prompt" ? (
                <span>
                  <span className="prompt-user">gaminghackintosh</span>
                  <span className="prompt-divider">@</span>
                  <span className="prompt-host">macweb.dev</span>
                  <span className="prompt-sign">:~$ </span>
                  <span className="prompt-text">{entry.text}</span>
                </span>
              ) : (
                renderLine(entry.text)
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Зона ввода */}
        <div className="terminal-input-wrapper">
          <span className="prompt-user">gaminghackintosh</span>
          <span className="prompt-divider">@</span>
          <span className="prompt-host">macweb.dev</span>
          <span className="prompt-sign">:~$ </span>
          <input
            ref={inputRef}
            value={input}
            maxLength={2000}
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
            className="terminal-interactive-input"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}