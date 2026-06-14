import React, { useState, useEffect, useCallback } from "react";

// ─── ABOUT PAGE ─────────────────────────────────────────────────────────────
export const AboutPage = () => (
  <div className="sf-local-page">
    <div className="sf-glass-card about-card">
      <div className="about-icon">🍎</div>
      <h1 className="sf-title">About This Mac</h1>
      <p className="sf-subtitle"><strong>macweb.dev</strong> – macOS Sonoma web simulation.</p>
      
      <div className="sf-specs-list">
        <div className="sf-spec-row">
          <span className="sf-spec-label">Version</span>
          <span className="sf-spec-value">14.0.1 (23A344)</span>
        </div>
        <div className="sf-spec-row">
          <span className="sf-spec-label">Processor</span>
          <span className="sf-spec-value">Apple M3 Max (Virtual)</span>
        </div>
        <div className="sf-spec-row">
          <span className="sf-spec-label">Memory</span>
          <span className="sf-spec-value">16 GB LPDDR5X</span>
        </div>
        <div className="sf-spec-row">
          <span className="sf-spec-label">Graphics</span>
          <span className="sf-spec-value">Integrated GPU (16-core)</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── HACKINTOSH PAGE ────────────────────────────────────────────────────────
export const HackintoshPage = () => (
  <div className="sf-local-page">
    <div className="sf-glass-card">
      <div className="hero-icon">🖥️</div>
      <h1 className="sf-title">macweb.dev</h1>
      <p className="sf-description">
        Welcome to the project! Experience a web-native macOS environment running directly in your browser. No hardware required.
      </p>
      <a 
        href="https://github.com/gaminghackintosh/macweb.dev" 
        target="_blank" 
        rel="noreferrer" 
        className="sf-btn sf-btn-primary"
      >
        View Source on GitHub
      </a>
    </div>
  </div>
);

// ─── CATS PAGE ──────────────────────────────────────────────────────────────
export const CatsPage = () => {
  const [catImg, setCatImg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCat = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=1");
      const data = await res.json();
      if (data[0]?.url) setCatImg(data[0].url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCat(); }, []);

  return (
    <div className="sf-local-page">
      <div className="sf-glass-card">
        <h1 className="sf-title">Random Cat</h1>
        <div className="cat-image-container">
          {loading ? (
            <div className="sf-spinner"></div>
          ) : catImg ? (
            <img src={catImg} alt="Random Cat" className="cat-img" />
          ) : (
            <p className="sf-description">Could not load cat. Try again!</p>
          )}
        </div>
        <button className="sf-btn sf-btn-secondary" onClick={fetchCat} disabled={loading}>
          {loading ? "Loading..." : "Next Cat"}
        </button>
      </div>
    </div>
  );
};

// ─── SURPRISE PAGE ──────────────────────────────────────────────────────────
const SURPRISES = [
  { emoji: "🐱", title: "Cat Approved!", text: "You've clicked the button 42 times today? The cat is impressed." },
  { emoji: "🍕", title: "Secret Pizza", text: "There's a hidden pizza in macOS. Just kidding. Or is there?" },
  { emoji: "🚀", title: "You're a Hacker!", text: "You just hacked the mainframe. (Just kidding)" },
  { emoji: "🎲", title: "Randomness", text: "The chance you're reading this is exactly 100%." },
  { emoji: "🐢", title: "Slow Internet?", text: "It's not Safari lagging – a turtle got stuck in the router." },
  { emoji: "💻", title: "Fun Fact", text: "This Safari window is completely fake, but it feels real, right?" },
  { emoji: "🎭", title: "Surprise!", text: "You expected an error, but got another surprise!" },
  { emoji: "🧠", title: "Knowledge", text: "Apple M3 Max in a browser? That's React magic, not silicon." },
];

const getRandomSurprise = () => SURPRISES[Math.floor(Math.random() * SURPRISES.length)];

export const SurprisePage = () => {
  const [surprise, setSurprise] = useState(getRandomSurprise());
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNewSurprise = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setSurprise(getRandomSurprise());
      setIsAnimating(false);
    }, 250);
  }, []);

  return (
    <div className="sf-local-page sf-surprise-bg">
      <div className={`sf-glass-card surprise-card ${isAnimating ? "fade-out" : "fade-in"}`}>
        <div className="surprise-emoji">{surprise.emoji}</div>
        <h1 className="sf-title">{surprise.title}</h1>
        <p className="sf-description">{surprise.text}</p>
        <button className="sf-btn sf-btn-primary surprise-btn" onClick={handleNewSurprise}>
          Roll Again
        </button>
      </div>
    </div>
  );
};

// ─── MEMORY GAME ────────────────────────────────────────────────────────────
const EMOJIS = ["🍎", "🚀", "🐱", "🍕", "💻", "🎨", "🔒", "✨"];

export const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);

  useEffect(() => {
    const doubleCards = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    setCards(doubleCards);
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || solved.includes(index) || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setSolved([...solved, ...newFlipped]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const restartGame = () => {
    setFlipped([]);
    setSolved([]);
    setTimeout(() => {
      setCards([...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5));
    }, 300);
  };

  const isWon = solved.length === cards.length && cards.length > 0;

  return (
    <div className="sf-local-page">
      <div className="sf-glass-card game-card">
        <h1 className="sf-title">Memory Match</h1>
        <p className="sf-subtitle">Find all the matching pairs</p>
        
        <div className="memory-grid">
          {cards.map((emoji, i) => (
            <div 
              key={i} 
              className={`memory-card ${flipped.includes(i) || solved.includes(i) ? "flipped" : ""}`}
              onClick={() => handleCardClick(i)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">?</div>
                <div className="memory-card-back">{emoji}</div>
              </div>
            </div>
          ))}
        </div>
        
        {isWon && (
          <div className="win-message">
            <h2>You Won! 🎉</h2>
            <button className="sf-btn sf-btn-primary" onClick={restartGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MATH GAME (NEW) ────────────────────────────────────────────────────────
export const MathGame = () => {
  const [equation, setEquation] = useState({ a: 0, b: 0, op: "+", answer: 0 });
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing"); // playing, correct, wrong

  const generateEquation = useCallback(() => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 12) + 2;
    let b = Math.floor(Math.random() * 12) + 2;
    let ans = 0;

    if (op === "+") ans = a + b;
    else if (op === "-") {
      if (a < b) [a, b] = [b, a]; // Prevent negative answers for simplicity
      ans = a - b;
    } else if (op === "×") {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
    }

    // Generate wrong options close to the real answer
    let opts = new Set([ans]);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      if (offset !== 0 && ans + offset >= 0) opts.add(ans + offset);
    }

    setEquation({ a, b, op, answer: ans });
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setStatus("playing");
  }, []);

  useEffect(() => {
    generateEquation();
  }, [generateEquation]);

  const handleAnswer = (selected) => {
    if (status !== "playing") return;
    
    if (selected === equation.answer) {
      setStatus("correct");
      setScore((s) => s + 1);
      setTimeout(generateEquation, 600);
    } else {
      setStatus("wrong");
      setScore(0);
      setTimeout(generateEquation, 800);
    }
  };

  return (
    <div className="sf-local-page">
      <div className="sf-glass-card game-card">
        <h1 className="sf-title">Brain Trainer</h1>
        <p className="sf-subtitle">Score: <span className="score-badge">{score}</span></p>

        <div className={`equation-display status-${status}`}>
          {equation.a} {equation.op} {equation.b} = ?
        </div>

        <div className="math-options-grid">
          {options.map((opt, i) => (
            <button 
              key={i} 
              className={`math-option-btn ${status !== "playing" && opt === equation.answer ? "correct" : ""}`}
              onClick={() => handleAnswer(opt)}
              disabled={status !== "playing"}
            >
              {opt}
            </button>
          ))}
        </div>

        {status === "wrong" && <p className="error-text">Oops! Back to 0.</p>}
      </div>
    </div>
  );
};