import { useEffect, useState, useRef } from "react";

// ─── Love Letter Page Component ───────────────────────────────────────────────
// Drop this as a new page in your proposal project.
// bgAudioRef is passed from the parent (SureshProposal) so the main music
// is paused while this page is active and resumed when leaving.
// song1 plays automatically when this page opens.

export default function LoveLetter({ onBack, bgAudioRef }) {
  const letterAudioRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState([]);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterReady, setLetterReady] = useState(false);
  const [particles, setParticles] = useState([]);

  const letterLines = [
    { text: "I don't need a thousand words to tell you what you mean to me.", delay: 0, style: "opening" },
    { text: "I just need you to feel this —", delay: 0.3, style: "opening-sub" },
    { text: "I don't know exactly when it happened.", delay: 1.2, style: "body" },
    { text: "There was no big moment, no lightning strike.", delay: 1.6, style: "body" },
    { text: "One day I just looked at you and realised —", delay: 2.1, style: "body" },
    { text: "my heart had already decided.", delay: 2.5, style: "emphasis" },
    { text: "Without asking me. Without warning me.", delay: 3.0, style: "body" },
    { text: "It had already chosen you, completely.", delay: 3.5, style: "emphasis" },
    { text: "I think about the small things the most.", delay: 4.5, style: "body" },
    { text: "Not the grand moments — the small ones.", delay: 5.0, style: "body" },
    { text: "The way you talk.", delay: 5.5, style: "small" },
    { text: "The way you go quiet sometimes and your eyes say everything your mouth doesn't.", delay: 6.0, style: "small" },
    { text: "The way you don't even realise how deeply you affect the people around you.", delay: 6.6, style: "small" },
    { text: "I notice all of it. Every single thing.", delay: 7.2, style: "emphasis" },
    { text: "Suresh, I love you in a way that frightens me sometimes.", delay: 8.2, style: "deep" },
    { text: "Because it's real.", delay: 8.8, style: "deep-small" },
    { text: "Because it's deep.", delay: 9.2, style: "deep-small" },
    { text: "Because losing it would break something in me that could never be fixed again.", delay: 9.7, style: "deep" },
    { text: "And if I had to choose again —", delay: 10.8, style: "body" },
    { text: "a thousand times over, in a thousand different lives —", delay: 11.3, style: "body" },
    { text: "I would find you every single time.", delay: 11.9, style: "emphasis" },
    { text: "I would always, always choose you.", delay: 12.5, style: "emphasis" },
    { text: "You are my favourite feeling in this whole world.", delay: 13.6, style: "closing" },
    { text: "Yours, completely and forever 💕🌹", delay: 14.4, style: "signature" },
    { text: "From", delay: 14.4, style: "signature" },
    { text: "10/10", delay: 14.4, style: "emphasis" },
  ];

  // Floating heart particles
  useEffect(() => {
    const iv = setInterval(() => {
      if (!letterReady) return;
      setParticles(p => [
        ...p.slice(-25),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          emoji: ["💕","❤️","🌹","✨","💖","🥀"][Math.floor(Math.random() * 6)],
          size: Math.random() * 14 + 10,
          dur: Math.random() * 6 + 5,
          delay: Math.random() * 2,
        }
      ]);
    }, 800);
    return () => clearInterval(iv);
  }, [letterReady]);

  // Envelope → letter reveal sequence
  useEffect(() => {
    const t1 = setTimeout(() => setEnvelopeOpen(true), 800);
    const t2 = setTimeout(() => setLetterReady(true), 2000);
    const t3 = setTimeout(() => setVisible(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Stagger each line appearing
  useEffect(() => {
    if (!visible) return;
    letterLines.forEach((_, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, i]);
      }, letterLines[i].delay * 1000);
    });
  }, [visible]);

  // Audio: pause bg music, play song1
  useEffect(() => {
    if (bgAudioRef?.current) bgAudioRef.current.pause();
    const audio = letterAudioRef.current;
    if (audio) {
      audio.volume = 0.45;
      audio.loop = true;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) { audio.pause(); audio.currentTime = 0; }
      if (bgAudioRef?.current) {
        bgAudioRef.current.volume = 0.6;
        bgAudioRef.current.play().catch(() => {});
      }
    };
  }, []);

  const getLineStyle = (style) => {
    const base = {
      transition: "opacity 1.2s ease, transform 1.2s ease",
      textAlign: "center",
      width: "100%",
    };
    switch(style) {
      case "opening":
        return { ...base, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(17px,3vw,24px)", fontStyle: "italic", color: "#ffccd5", fontWeight: 600, lineHeight: 1.6, marginBottom: 4 };
      case "opening-sub":
        return { ...base, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(15px,2.5vw,20px)", fontStyle: "italic", color: "rgba(255,180,200,0.75)", marginBottom: 28, lineHeight: 1.5 };
      case "body":
        return { ...base, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(14px,2.2vw,19px)", color: "rgba(255,220,230,0.82)", lineHeight: 1.9, marginBottom: 4, fontStyle: "italic" };
      case "small":
        return { ...base, fontFamily: "'Caveat', cursive", fontSize: "clamp(14px,2vw,18px)", color: "rgba(255,200,218,0.72)", lineHeight: 2, marginBottom: 2 };
      case "emphasis":
        return { ...base, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,2.8vw,22px)", color: "#ffb3c6", fontWeight: 700, fontStyle: "italic", lineHeight: 1.7, marginBottom: 6, textShadow: "0 0 20px rgba(255,100,140,0.5)" };
      case "deep":
        return { ...base, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(15px,2.5vw,21px)", color: "rgba(255,210,225,0.88)", lineHeight: 1.9, fontStyle: "italic", marginBottom: 4 };
      case "deep-small":
        return { ...base, fontFamily: "'Caveat', cursive", fontSize: "clamp(16px,2.5vw,20px)", color: "#ff8fab", lineHeight: 1.8, marginBottom: 2, textShadow: "0 0 12px rgba(255,100,140,0.4)" };
      case "closing":
        return { ...base, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px,3vw,26px)", color: "#ffccd5", fontStyle: "italic", fontWeight: 600, marginTop: 12, marginBottom: 6, textShadow: "0 0 24px rgba(255,130,160,0.5)", lineHeight: 1.6 };
      case "signature":
        return { ...base, fontFamily: "'Caveat', cursive", fontSize: "clamp(20px,3.5vw,30px)", color: "#ff8fab", marginTop: 16, textShadow: "0 0 20px rgba(255,100,140,0.6)", letterSpacing: 1 };
      default:
        return base;
    }
  };

  return (
    <div style={s.root}>
      <audio ref={letterAudioRef} loop preload="auto">
        <source src="/music/song8.mp3" type="audio/mp3" />
      </audio>

      {/* Deep atmospheric background */}
      <div style={s.bgBase} />
      <div style={s.bgGlow1} />
      <div style={s.bgGlow2} />
      <div style={s.bgGlow3} />

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "fixed", bottom: -20, left: `${p.left}%`,
          fontSize: p.size, pointerEvents: "none", zIndex: 2,
          animation: `floatUp ${p.dur}s ease-out ${p.delay}s forwards`,
          filter: "drop-shadow(0 0 6px rgba(255,120,160,0.5))",
        }}>{p.emoji}</div>
      ))}

      {/* Back button */}
      {letterReady && (
        <button style={s.backBtn} onClick={onBack}>
          ← Back
        </button>
      )}

      {/* Now playing pill */}
      {letterReady && (
        <div style={s.nowPlaying}>
          <span style={s.musicDot} />
          <span style={s.nowPlayingText}>🎵 Playing your song</span>
        </div>
      )}

      {/* Envelope animation */}
      {!letterReady && (
        <div style={s.envelopeWrap}>
          <div style={{ ...s.envelope, transform: envelopeOpen ? "scale(1.08)" : "scale(1)", opacity: envelopeOpen ? 0 : 1, transition: "all 1.2s ease" }}>
            <div style={s.envBody}>
              <div style={s.envFlap} />
              <div style={s.envLines}>
                <div style={s.envLine} />
                <div style={s.envLine} />
                <div style={s.envLine} />
              </div>
              <div style={s.envSeal}>💌</div>
            </div>
          </div>
          <p style={s.envHint}>Opening your letter...</p>
        </div>
      )}

      {/* The actual letter */}
      {letterReady && (
        <div style={s.letterWrap}>
          {/* Decorative header */}
          <div style={s.letterHeader}>
            <div style={s.headerLine} />
            <span style={s.headerHeart}>💌</span>
            <div style={s.headerLine} />
          </div>

          <div style={s.salutation}>My Suresh,</div>

          {/* Letter lines */}
          <div style={s.linesWrap}>
            {letterLines.map((line, i) => {
              // Group lines into paragraphs
              const isGroupStart = [0, 2, 8, 14, 18, 22].includes(i);
              return (
                <div key={i}>
                  {isGroupStart && i !== 0 && <div style={s.spacer} />}
                  <div style={{
                    ...getLineStyle(line.style),
                    opacity: lines.includes(i) ? 1 : 0,
                    transform: lines.includes(i) ? "translateY(0)" : "translateY(18px)",
                  }}>
                    {line.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative footer */}
          {lines.length >= letterLines.length - 1 && (
            <div style={s.letterFooter}>
              <div style={s.footerDots}>
                {["💕","🌹","💕","🌹","💕"].map((e, i) => (
                  <span key={i} style={{
                    fontSize: 14,
                    animation: `heartPop 1.5s ease ${i * 0.15}s infinite alternate`,
                    display: "inline-block",
                    filter: "drop-shadow(0 0 5px rgba(255,100,140,0.5))",
                  }}>{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Caveat:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5) rotate(-10deg); opacity: 0.8; }
          60% { opacity: 0.9; }
          100% { transform: translateY(-110vh) scale(1.1) rotate(15deg); opacity: 0; }
        }
        @keyframes heartPop {
          0% { transform: scale(1) rotate(-5deg); }
          100% { transform: scale(1.3) rotate(5deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes musicBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes envPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(255,100,140,0.3); }
          50% { transform: scale(1.04); box-shadow: 0 0 70px rgba(255,100,140,0.6); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,138,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    overflowX: "hidden",
    overflowY: "auto",
    position: "relative",
    fontFamily: "'Cormorant Garamond', serif",
    paddingBottom: 80,
  },
  bgBase: {
    position: "fixed", inset: 0,
    background: "radial-gradient(ellipse 120% 100% at 50% 0%, #0d0010 0%, #06000e 40%, #020008 70%, #000004 100%)",
    zIndex: 0,
  },
  bgGlow1: {
    position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
    width: 900, height: 500, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(180,20,80,0.18) 0%, rgba(100,10,50,0.08) 50%, transparent 70%)",
    filter: "blur(80px)", animation: "glowPulse 8s ease-in-out infinite",
    zIndex: 0, pointerEvents: "none",
  },
  bgGlow2: {
    position: "fixed", bottom: "0%", left: "20%",
    width: 600, height: 400, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(100,10,120,0.14) 0%, transparent 70%)",
    filter: "blur(100px)", animation: "glowPulse 12s ease-in-out infinite reverse",
    zIndex: 0, pointerEvents: "none",
  },
  bgGlow3: {
    position: "fixed", top: "40%", right: "5%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(200,30,80,0.08) 0%, transparent 70%)",
    filter: "blur(80px)", animation: "glowPulse 10s ease-in-out 2s infinite",
    zIndex: 0, pointerEvents: "none",
  },
  backBtn: {
    position: "fixed", top: 24, left: 24,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,150,180,0.2)",
    color: "rgba(255,180,200,0.7)",
    padding: "8px 18px", borderRadius: 50,
    fontSize: 12, cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic", letterSpacing: 1,
    backdropFilter: "blur(10px)", zIndex: 100,
    transition: "all 0.3s ease",
    animation: "fadeSlideIn 0.6s ease forwards",
  },
  nowPlaying: {
    position: "fixed", top: 24, right: 24,
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,50,100,0.08)",
    border: "1px solid rgba(255,100,140,0.2)",
    padding: "7px 16px", borderRadius: 50,
    backdropFilter: "blur(10px)", zIndex: 100,
    animation: "fadeSlideIn 0.6s ease 0.3s forwards",
    opacity: 0, animationFillMode: "forwards",
  },
  musicDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#ff6b8a",
    boxShadow: "0 0 8px rgba(255,107,138,0.8)",
    animation: "musicBlink 1.2s ease-in-out infinite",
    flexShrink: 0,
  },
  nowPlayingText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 12, color: "rgba(255,160,190,0.7)",
    fontStyle: "italic", letterSpacing: 1,
  },

  // Envelope
  envelopeWrap: {
    position: "fixed", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    zIndex: 50,
  },
  envelope: {
    width: 220, height: 160,
    animation: "envPulse 2s ease-in-out infinite",
  },
  envBody: {
    width: "100%", height: "100%",
    background: "linear-gradient(145deg, rgba(40,10,30,0.95), rgba(20,5,20,0.98))",
    border: "1px solid rgba(255,100,140,0.3)",
    borderRadius: 8, position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 50px rgba(255,60,120,0.3), inset 0 0 30px rgba(255,50,100,0.05)",
  },
  envFlap: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: "50%",
    background: "linear-gradient(to bottom, rgba(255,80,130,0.08), transparent)",
    borderBottom: "1px solid rgba(255,100,140,0.15)",
    borderRadius: "8px 8px 0 0",
  },
  envLines: {
    display: "flex", flexDirection: "column", gap: 8, width: "55%",
  },
  envLine: {
    height: 1, background: "rgba(255,150,180,0.2)", borderRadius: 2,
  },
  envSeal: {
    position: "absolute",
    fontSize: 36,
    filter: "drop-shadow(0 0 12px rgba(255,100,140,0.8))",
    animation: "heartPop 2s ease-in-out infinite alternate",
  },
  envHint: {
    marginTop: 24,
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: 14,
    color: "rgba(255,150,180,0.5)",
    letterSpacing: 2,
    animation: "musicBlink 2s ease-in-out infinite",
  },

  // Letter
  letterWrap: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 680,
    padding: "100px 36px 60px",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  letterHeader: {
    display: "flex", alignItems: "center", gap: 16,
    marginBottom: 32, width: "100%",
    animation: "fadeSlideIn 0.8s ease forwards",
  },
  headerLine: {
    flex: 1, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(255,107,138,0.4), transparent)",
  },
  headerHeart: {
    fontSize: 28,
    filter: "drop-shadow(0 0 12px rgba(255,100,140,0.7))",
    animation: "heartPop 2s ease infinite alternate",
    display: "inline-block",
  },
  salutation: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(22px,4vw,34px)",
    fontStyle: "italic",
    fontWeight: 700,
    color: "#ffccd5",
    marginBottom: 28,
    textShadow: "0 0 30px rgba(255,120,160,0.5)",
    textAlign: "center",
    animation: "fadeSlideIn 0.8s ease 0.2s forwards",
    opacity: 0, animationFillMode: "forwards",
    letterSpacing: 1,
  },
  linesWrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", width: "100%", gap: 2,
  },
  spacer: { height: 20 },
  letterFooter: {
    marginTop: 40, textAlign: "center",
  },
  footerDots: {
    display: "flex", gap: 12, justifyContent: "center", alignItems: "center",
  },
};