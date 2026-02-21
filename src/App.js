import React, { useEffect, useState, useRef } from "react";
import LoveLetter from "./LoveLetter";

// ─── Import your photos from src/images ───────────────────────────────────────
import photo1 from "../src/images/photo1.png";
import photo3 from "../src/images/photo2.png";
import photo2 from "../src/images/photo3.png";
import photo4 from "../src/images/photo4.png";
import photo5 from "../src/images/photo5.png";
import photo6 from "../src/images/photo6.png";

// ─── Memory moments data ──────────────────────────────────────────────────────
// Place song1.mp3 … song6.mp3 inside your /public/music/ folder
const memories = [
  {
    id: 1,
    src: photo1,
    caption: "The First Look 👀",
    note: "You changed the whole room without even trying.",
    rotate: "-4deg",
    color: "rgba(255,100,150,0.25)",
    song: "/music/song1.mp3",
  },
  {
    id: 2,
    src: photo2,
    caption: "Our First Conversation 💬",
    note: "I was nervous. You were effortlessly you.",
    rotate: "3deg",
    color: "rgba(160,100,255,0.25)",
    song: "/music/song2.mp3",
  },
  {
    id: 3,
    src: photo3,
    caption: "The Realisation 🥺",
    note: "It has to be you. Only ever you.",
    rotate: "-2deg",
    color: "rgba(60,180,255,0.25)",
    song: "/music/song3.mp3",
  },
  {
    id: 4,
    src: photo4,
    caption: "My Favourite Memory ☕",
    note: "This is the one I replay the most.",
    rotate: "5deg",
    color: "rgba(255,160,60,0.25)",
    song: "/music/song4.mp3",
  },
  {
    id: 5,
    src: photo5,
    caption: "Right Now 💍",
    note: "The moment I decided — it's always going to be you.",
    rotate: "-3deg",
    color: "rgba(60,220,180,0.25)",
    song: "/music/song5.mp3",
  },
  {
    id: 6,
    src: photo6,
    caption: "Right Now 💍",
    note: "The moment I decided — it's always going to be you.",
    rotate: "-3deg",
    color: "rgba(60,220,180,0.25)",
    song: "/music/song6.mp3",
  },
];

// ─── Background data ──────────────────────────────────────────────────────────
const pages = ["Home", "Our Story", "A Letter From My Heart", "Finally ??"];

const starField = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 3 + 0.5,
  delay: Math.random() * 8,
  duration: Math.random() * 5 + 2,
  opacity: Math.random() * 0.8 + 0.2,
  bright: Math.random() > 0.85,
}));

const shootingStars = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  top: Math.random() * 55,
  left: Math.random() * 65,
  delay: i * 4 + Math.random() * 6,
  duration: Math.random() * 1.2 + 0.8,
}));

const petals = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: Math.random() * 8 + 8,
  size: Math.random() * 10 + 12,
  emoji: ["🌸", "🌹", "🌺", "💮", "🏵️", "🌷"][Math.floor(Math.random() * 6)],
}));

const floatingOrbs = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  size: Math.random() * 200 + 80,
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: Math.random() * 20 + 15,
  color: [
    "rgba(255,60,120,0.06)",
    "rgba(120,40,200,0.07)",
    "rgba(40,100,220,0.05)",
    "rgba(255,100,60,0.05)",
    "rgba(60,200,180,0.04)",
    "rgba(200,60,200,0.05)",
  ][i],
}));

// ─── Lightbox floating hearts ─────────────────────────────────────────────────
const LightboxHearts = () => {
  const [lHearts, setLHearts] = useState([]);
  useEffect(() => {
    const iv = setInterval(() => {
      setLHearts((p) => [
        ...p.slice(-30),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          emoji: ["❤️", "💕", "💖", "✨", "🌹"][Math.floor(Math.random() * 5)],
          size: Math.random() * 14 + 14,
          dur: Math.random() * 2 + 2,
        },
      ]);
    }, 400);
    return () => clearInterval(iv);
  }, []);
  return (
    <>
      {lHearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "fixed",
            bottom: 0,
            left: `${h.left}%`,
            fontSize: h.size,
            pointerEvents: "none",
            zIndex: 1000,
            animation: `lbHeart ${h.dur}s ease-out forwards`,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </>
  );
};

// ─── Cinematic Lightbox ───────────────────────────────────────────────────────
// Receives bgAudioRef so it can pause/resume background music
const Lightbox = ({ memory, onClose, onPrev, onNext, total, index, bgAudioRef }) => {
  const photoAudioRef = useRef(null);

  // Whenever the memory (photo) changes, switch songs
  useEffect(() => {
    const audio = photoAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = memory.song;
    audio.volume = 0.7;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [memory.song]);

  // On mount: pause bg music and start photo song
  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.pause();
    const audio = photoAudioRef.current;
    if (audio) {
      audio.src = memory.song;
      audio.volume = 0.7;
      audio.loop = true;
      audio.play().catch(() => {});
    }
    return () => {
      // On unmount (lightbox closed): stop photo song, resume bg
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.volume = 0.6;
        bgAudioRef.current.play().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div style={lb.overlay} onClick={onClose}>
      {/* Hidden audio element for per-photo songs */}
      <audio ref={photoAudioRef} loop preload="auto" />

      <LightboxHearts />

      {/* Background glow matching photo color */}
      <div
        style={{
          ...lb.bgGlow,
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${memory.color.replace("0.25", "0.35")} 0%, transparent 70%)`,
        }}
      />

      {/* Main card */}
      <div style={lb.card} onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button style={lb.closeBtn} onClick={onClose}>✕</button>

        {/* Navigation arrows */}
        <button style={lb.arrowLeft} onClick={(e) => { e.stopPropagation(); onPrev(); }}>‹</button>
        <button style={lb.arrowRight} onClick={(e) => { e.stopPropagation(); onNext(); }}>›</button>

        {/* Photo */}
        <div style={lb.photoWrap}>
          <div style={{ ...lb.photoGlow, background: `radial-gradient(circle, ${memory.color} 0%, transparent 70%)` }} />
          <img src={memory.src} alt={memory.caption} style={lb.photo} />
          <div style={lb.grain} />
          <div style={lb.vignette} />
        </div>

        {/* Song label */}
        <div style={lb.nowPlaying}>
          <span style={lb.musicIcon}>🎵</span>
          <span style={lb.nowPlayingText}>Playing Song {index + 1}</span>
        </div>

        {/* Caption area */}
        <div style={lb.captionArea}>
          <div style={lb.captionHeart}>💕</div>
          <h3 style={lb.captionTitle}>{memory.caption}</h3>
          <p style={lb.captionNote}>{memory.note}</p>
          <div style={lb.dotsRow}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  ...lb.lbDot,
                  background: i === index ? "#ff6b8a" : "rgba(255,255,255,0.2)",
                  transform: i === index ? "scale(1.4)" : "scale(1)",
                  boxShadow: i === index ? "0 0 8px rgba(255,107,138,0.8)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <p style={lb.hint}>Press ESC to close · ← → to navigate</p>
    </div>
  );
};

// ─── Polaroid Card ────────────────────────────────────────────────────────────
const PolaroidCard = ({ memory, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...pol.wrap,
        transform: hovered
          ? "rotate(0deg) scale(1.06) translateY(-10px)"
          : `rotate(${memory.rotate}) scale(1)`,
        boxShadow: hovered
          ? `0 30px 60px rgba(0,0,0,0.7), 0 0 40px ${memory.color.replace("0.25", "0.5")}`
          : "0 12px 40px rgba(0,0,0,0.6)",
        zIndex: hovered ? 10 : index,
        animationDelay: `${index * 0.12}s`,
      }}
    >
      <div style={{ ...pol.tape, background: memory.color.replace("0.25", "0.5") }} />
      <div style={pol.photoBox}>
        <img src={memory.src} alt={memory.caption} style={pol.img} />
        <div style={pol.photoOverlay} />
        <div style={{ ...pol.viewOverlay, opacity: hovered ? 1 : 0 }}>
          <span style={pol.viewIcon}>🎵</span>
          <span style={pol.viewText}>Play Memory</span>
        </div>
      </div>
      <div style={pol.bottom}>
        <p style={pol.bottomCaption}>{memory.caption}</p>
        <div style={{ ...pol.heartLine, color: memory.color.replace("0.25", "1") }}>
          {"♥".repeat(3)}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SureshProposal() {
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [yes, setYes] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [transitioning, setTransitioning] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [pageVisible, setPageVisible] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const noRef = useRef(null);

  // ─── Background music: start on first user interaction ───────────────────
  useEffect(() => {
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.6;
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
    };
    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);
    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (yes) {
      const interval = setInterval(() => {
        setHearts((prev) => [
          ...prev.slice(-60),
          {
            id: Date.now() + Math.random(),
            left: Math.random() * 100,
            size: Math.random() * 16 + 16,
            speed: Math.random() * 2 + 2,
            emoji: ["❤️", "💍", "✨", "💕", "💖", "🥂", "🌹", "💫"][Math.floor(Math.random() * 8)],
          },
        ]);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [yes]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const navigate = (idx) => {
    if (idx === currentPage || transitioning) return;
    setTransitioning(true);
    setPageVisible(false);
    setTimeout(() => {
      setCurrentPage(idx);
      setPageVisible(true);
      setTransitioning(false);
    }, 500);
  };

  const noMessages = [
    "Nope, wrong answer 😌",
    "Try again, sweetheart 💅",
    "That button doesn't work here 🙅‍♀️",
    "Are you sure?? Really?? 🥺",
    "Last chance... choose wisely 👀",
    "Okay fine... but you're still mine 😏",
  ];

  const dodgeNo = () => {
    const range = 200;
    setNoPos({
      x: Math.random() * range - range / 2,
      y: Math.random() * range - range / 2,
    });
    setNoCount((c) => c + 1);
  };

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () => setLightboxIndex((i) => (i - 1 + memories.length) % memories.length);
  const nextPhoto = () => setLightboxIndex((i) => (i + 1) % memories.length);

  return (
    <div style={styles.root}>
      {/* Background audio */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/music/Happy1.mp3" type="audio/mp3" />
      </audio>

      {/* Cursor glow */}
      <div style={{ ...styles.cursorGlow, left: `${mousePos.x}%`, top: `${mousePos.y}%` }} />

      {/* Sky layers */}
      <div style={styles.skyBase} />
      <div style={styles.skyMid} />
      <div style={styles.skyHorizon} />

      {/* Orbs */}
      {floatingOrbs.map((orb) => (
        <div key={orb.id} style={{
          position: "fixed", width: orb.size, height: orb.size,
          top: `${orb.top}%`, left: `${orb.left}%`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          filter: "blur(30px)",
          animation: `orbFloat ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
          zIndex: 0, pointerEvents: "none",
        }} />
      ))}

      {/* Nebulae */}
      <div style={styles.nebula1} />
      <div style={styles.nebula2} />
      <div style={styles.nebula3} />
      <div style={styles.nebula4} />

      {/* Stars */}
      {starField.map((s) => (
        <div key={s.id} style={{
          position: "fixed", borderRadius: "50%",
          background: s.bright ? "white" : "rgba(255,255,255,0.9)",
          width: s.size, height: s.size,
          top: `${s.top}%`, left: `${s.left}%`,
          opacity: s.opacity,
          animation: s.bright
            ? `twinkleBright ${s.duration}s ease-in-out ${s.delay}s infinite`
            : `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          zIndex: 1,
          boxShadow: s.bright
            ? "0 0 4px white, 0 0 8px rgba(200,220,255,0.8)"
            : "0 0 2px rgba(255,255,255,0.4)",
        }} />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((s) => (
        <div key={s.id} style={{
          position: "fixed", height: 2, width: 3,
          top: `${s.top}%`, left: `${s.left}%`,
          background: "linear-gradient(90deg, white, rgba(255,210,240,0.9), transparent)",
          borderRadius: 4,
          animation: `shootStar ${s.duration}s linear ${s.delay}s infinite`,
          zIndex: 2, opacity: 0,
        }} />
      ))}

      {/* Petals */}
      {petals.map((p) => (
        <div key={p.id} style={{
          position: "fixed", top: "-40px", left: `${p.left}%`,
          fontSize: p.size,
          animation: `floatPetal ${p.duration}s linear ${p.delay}s infinite`,
          zIndex: 2, pointerEvents: "none",
          filter: "drop-shadow(0 0 4px rgba(255,150,180,0.3))",
        }}>{p.emoji}</div>
      ))}

      {/* YES Hearts */}
      {yes && hearts.map((h) => (
        <div key={h.id} style={{
          position: "fixed", bottom: 0, left: `${h.left}%`,
          fontSize: h.size,
          animation: `riseHeart ${h.speed}s ease-out forwards`,
          zIndex: 50, pointerEvents: "none",
        }}>{h.emoji}</div>
      ))}

      {/* Lightbox — passes bgAudioRef so it can pause/resume bg music */}
      {lightboxIndex !== null && (
        <Lightbox
          memory={memories[lightboxIndex]}
          index={lightboxIndex}
          total={memories.length}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          bgAudioRef={audioRef}
        />
      )}

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoRing}>💍</span>
          <span style={styles.navLogoText}>For Suresh</span>
        </div>
        <div style={styles.navLinks}>
          {pages.map((p, i) => (
            <button key={p} onClick={() => navigate(i)} style={{
              ...styles.navBtn,
              ...(currentPage === i ? styles.navBtnActive : {}),
            }}>
              {currentPage === i && <span style={styles.navDot} />}
              {p}
            </button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main style={{
        ...styles.main,
        opacity: pageVisible ? 1 : 0,
        transform: pageVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        {/* ── PAGE 0 — HOME ── */}
        {currentPage === 0 && (
          <div style={styles.page}>
            <div style={styles.glowCircle} />
            <div style={styles.glowCircle2} />
            <p style={styles.eyebrow}>
              <span style={styles.eyebrowLine} />✨ A message from the heart ✨<span style={styles.eyebrowLine} />
            </p>
            <h1 style={styles.heroTitle}>
              Hi, <span style={styles.nameGlow}>BUDANKAYYY</span>
            </h1>
            <p style={styles.subHeroLine}>I made this just for you ❤️</p>
            <div style={styles.quotePara}>
              <span style={styles.word1}>You are not just a chapter in my life —</span><br />
              <span style={styles.word2}>You are the whole story of my life.</span><br />
              <span style={styles.word3}>You don't even know how much I love you.</span>
            </div>
            <button style={styles.primaryBtn} onClick={() => navigate(1)}>
              <span style={styles.btnGlow} />
              Begin Our Story →
            </button>
            <div style={styles.scrollHint}>∞ &nbsp; I love you to infinity, in any situation &nbsp; ∞</div>
            <div style={styles.floatHeart1}>💕</div>
            <div style={styles.floatHeart2}>✨</div>
            <div style={styles.floatHeart3}>🌹</div>
          </div>
        )}

        {/* ── PAGE 1 — OUR STORY (Polaroid Gallery) ── */}
        {currentPage === 1 && (
          <div style={styles.page}>
            <p style={styles.eyebrow}>
              <span style={styles.eyebrowLine} />📸 Our Moments<span style={styles.eyebrowLine} />
            </p>
            <h2 style={styles.pageTitle}>Every Moment With You</h2>
            <p style={styles.gallerySubtitle}>
              Six little memories. Each one a whole universe. 🌙<br />
              <span style={styles.galleryHint}>Click any photo to relive the moment with its song 🎵✨</span>
            </p>

            {/* Polaroid Gallery */}
            <div style={pol.gallery}>
              {memories.map((m, i) => (
                <PolaroidCard key={m.id} memory={m} index={i} onClick={openLightbox} />
              ))}
            </div>

            {/* Auto-slideshow strip at bottom */}
            <div style={strip.wrap}>
              <p style={strip.label}>📽️ Quick Slideshow</p>
              <div style={strip.track}>
                {[...memories, ...memories].map((m, i) => (
                  <div
                    key={i}
                    style={strip.thumb}
                    onClick={() => openLightbox(i % memories.length)}
                  >
                    <img src={m.src} alt={m.caption} style={strip.img} />
                    <div style={strip.thumbOverlay} />
                  </div>
                ))}
              </div>
            </div>

            <button style={styles.primaryBtn} onClick={() => navigate(2)}>
              <span style={styles.btnGlow} />
              About You →
            </button>
          </div>
        )}

        {/* ── PAGE 2 — A LETTER FROM MY HEART ── */}
        {currentPage === 2 && (
          <LoveLetter
            onBack={() => navigate(1)}
            onNext={() => navigate(3)}
            bgAudioRef={audioRef}
          />
        )}

        {/* ── PAGE 3 — THE QUESTION ── */}
        {currentPage === 3 && (
          <div style={styles.page}>
            {!yes ? (
              <>
                <div style={styles.ringContainer}>
                  <div style={styles.ringGlow1} /><div style={styles.ringGlow2} />
                  <div style={styles.ringEmoji}>💍</div>
                </div>
                <p style={styles.eyebrow}>
                  <span style={styles.eyebrowLine} />The Moment of Truth<span style={styles.eyebrowLine} />
                </p>
                <h2 style={styles.proposalTitle}>
                  Suresh,<br /><span style={styles.nameGlow}>Will you marry me?</span>
                </h2>
                <p style={styles.proposalSub}>
                  After all of this... you already know my answer is yes to you, forever.<br />Now what's yours? 🥺
                </p>
                {noCount > 0 && (
                  <div style={styles.noMsgWrap}>
                    <p style={styles.noMsg}>{noMessages[Math.min(noCount - 1, noMessages.length - 1)]}</p>
                  </div>
                )}
                <div style={styles.proposalButtons}>
                  <button style={styles.yesBtn} onClick={() => setYes(true)}>
                    <span style={styles.yesBtnGlow} />YES, FOREVER ❤️
                  </button>
                  <button
                    ref={noRef}
                    style={{
                      ...styles.noBtn,
                      transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                      transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                    onMouseEnter={dodgeNo} onTouchStart={dodgeNo} onClick={dodgeNo}
                  >No</button>
                </div>
              </>
            ) : (
              <div style={styles.yesScreen}>
                <div style={styles.yesRingWrap}>
                  <div style={styles.yesRingPulse1} /><div style={styles.yesRingPulse2} /><div style={styles.yesRingPulse3} />
                  <div style={styles.yesRingEmoji}>💍</div>
                </div>
                <h1 style={styles.yesTitle}>He said <span style={styles.nameGlow}>YES!</span></h1>
                <p style={styles.yesSub}>Suresh is officially mine. 😌<br />The universe can relax now. ✨</p>
                <div style={styles.confettiRow}>
                  {["🥂","🎊","💖","🎉","💍","🌹","✨","💕"].map((e, i) => (
                    <span key={i} style={{
                      fontSize: 28, margin: "0 5px", display: "inline-block",
                      animation: `bounceItem ${0.4 + i * 0.08}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`,
                      filter: "drop-shadow(0 0 6px rgba(255,150,180,0.6))",
                    }}>{e}</span>
                  ))}
                </div>
                <p style={styles.yesForever}>Forever starts right now 💕</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Dots */}
      <div style={styles.dots}>
        {pages.map((_, i) => (
          <div key={i} onClick={() => navigate(i)} style={{
            ...styles.dot,
            background: currentPage === i ? "linear-gradient(135deg,#ff4d6d,#ff85a1)" : "rgba(255,255,255,0.2)",
            transform: currentPage === i ? "scale(1.5)" : "scale(1)",
            boxShadow: currentPage === i ? "0 0 14px rgba(255,77,109,0.8)" : "none",
          }} />
        ))}
      </div>

      {/* ── All CSS Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&family=Caveat:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes twinkle {
          0%,100% { opacity:0.1; transform:scale(0.7); }
          50% { opacity:0.9; transform:scale(1.4); }
        }
        @keyframes twinkleBright {
          0%,100% { opacity:0.5; transform:scale(1); }
          50% { opacity:1; transform:scale(2); box-shadow:0 0 8px white, 0 0 16px rgba(180,200,255,0.7); }
        }
        @keyframes shootStar {
          0% { transform:translateX(0) translateY(0) rotate(-30deg); opacity:0; width:3px; }
          8% { opacity:1; }
          75% { opacity:0.9; width:180px; }
          100% { transform:translateX(400px) translateY(220px) rotate(-30deg); opacity:0; width:220px; }
        }
        @keyframes floatPetal {
          0% { transform:translateY(-20px) rotate(0deg) scale(0.8); opacity:0; }
          8% { opacity:0.9; }
          92% { opacity:0.7; }
          100% { transform:translateY(115vh) rotate(900deg) scale(1.1); opacity:0; }
        }
        @keyframes riseHeart {
          0% { transform:translateY(0) scale(0.3) rotate(-10deg); opacity:1; }
          50% { transform:translateY(-50vh) scale(1) rotate(5deg); opacity:0.9; }
          100% { transform:translateY(-110vh) scale(0.6) rotate(-5deg); opacity:0; }
        }
        @keyframes lbHeart {
          0% { transform:translateY(0) scale(0.4); opacity:1; }
          100% { transform:translateY(-100vh) scale(0.9); opacity:0; }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1); }
          50% { transform:scale(1.12); }
        }
        @keyframes bounceItem {
          from { transform:translateY(0) rotate(-3deg); }
          to { transform:translateY(-14px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { background-position:-300% center; }
          100% { background-position:300% center; }
        }
        @keyframes nebulaDrift {
          0%,100% { transform:translate(0,0) scale(1); }
          33% { transform:translate(30px,-20px) scale(1.06); }
          66% { transform:translate(-15px,25px) scale(0.95); }
        }
        @keyframes orbFloat {
          0%,100% { transform:translate(0,0) scale(1); opacity:0.6; }
          33% { transform:translate(40px,-30px) scale(1.15); opacity:1; }
          66% { transform:translate(-20px,35px) scale(0.88); opacity:0.5; }
        }
        @keyframes colorWord1 {
          0%   { color:#ff9de2; text-shadow:0 0 14px rgba(255,157,226,0.9),0 0 35px rgba(255,100,200,0.5); }
          25%  { color:#ffe066; text-shadow:0 0 14px rgba(255,224,102,0.9),0 0 35px rgba(255,200,0,0.5); }
          50%  { color:#a0f0ed; text-shadow:0 0 14px rgba(160,240,237,0.9),0 0 35px rgba(0,220,210,0.5); }
          75%  { color:#ffb347; text-shadow:0 0 14px rgba(255,179,71,0.9),0 0 35px rgba(255,140,0,0.5); }
          100% { color:#ff9de2; text-shadow:0 0 14px rgba(255,157,226,0.9),0 0 35px rgba(255,100,200,0.5); }
        }
        @keyframes colorWord2 {
          0%   { color:#a8edea; text-shadow:0 0 14px rgba(168,237,234,0.9),0 0 35px rgba(0,220,210,0.5); }
          25%  { color:#ff9de2; text-shadow:0 0 14px rgba(255,157,226,0.9),0 0 35px rgba(255,100,200,0.5); }
          50%  { color:#c3b1e1; text-shadow:0 0 14px rgba(195,177,225,0.9),0 0 35px rgba(150,100,220,0.5); }
          75%  { color:#a8edea; text-shadow:0 0 14px rgba(168,237,234,0.9),0 0 35px rgba(0,200,200,0.5); }
          100% { color:#a8edea; text-shadow:0 0 14px rgba(168,237,234,0.9),0 0 35px rgba(0,220,210,0.5); }
        }
        @keyframes colorWord3 {
          0%   { color:#c3b1e1; text-shadow:0 0 16px rgba(195,177,225,1),0 0 40px rgba(150,100,220,0.6); }
          25%  { color:#ffccd5; text-shadow:0 0 16px rgba(255,204,213,1),0 0 40px rgba(255,100,140,0.6); }
          50%  { color:#ffe066; text-shadow:0 0 16px rgba(255,224,102,1),0 0 40px rgba(255,200,0,0.6); }
          75%  { color:#ff9de2; text-shadow:0 0 16px rgba(255,157,226,1),0 0 40px rgba(255,80,180,0.6); }
          100% { color:#c3b1e1; text-shadow:0 0 16px rgba(195,177,225,1),0 0 40px rgba(150,100,220,0.6); }
        }
        @keyframes ringPulse {
          0%,100% { transform:scale(1); opacity:0.5; }
          50% { transform:scale(1.8); opacity:0; }
        }
        @keyframes floatIcon {
          0%,100% { transform:translateY(0) rotate(-5deg); }
          50% { transform:translateY(-14px) rotate(5deg); }
        }
        @keyframes glowPulse {
          0%,100% { opacity:0.3; transform:scale(1); }
          50% { opacity:0.7; transform:scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes cursorGlowAnim {
          0%,100% { opacity:0.4; }
          50% { opacity:0.7; }
        }
        @keyframes lineExpand {
          from { width:0; opacity:0; }
          to { width:40px; opacity:1; }
        }
        @keyframes slideStrip {
          0% { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes lbFadeIn {
          from { opacity:0; transform:scale(0.88) translateY(30px); }
          to { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes polaroidIn {
          from { opacity:0; transform:translateY(40px) rotate(0deg) scale(0.85); }
          to { opacity:1; }
        }
        @keyframes heartBeat {
          0%,100% { transform:scale(1); }
          30% { transform:scale(1.3); }
          60% { transform:scale(1.1); }
        }
        @keyframes musicPulse {
          0%,100% { opacity:0.5; transform:scale(1); }
          50% { opacity:1; transform:scale(1.2); }
        }
        @keyframes musicPulse {
          0%,100% { opacity:0.6; transform:scale(1); }
          50% { opacity:1; transform:scale(1.15); }
        }

        button { cursor:pointer; }
        button:hover { filter:brightness(1.2); }
      `}</style>
    </div>
  );
}

// ─── Polaroid styles ──────────────────────────────────────────────────────────
const pol = {
  gallery: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 28,
    padding: "20px 10px 30px",
    width: "100%",
    maxWidth: 860,
  },
  wrap: {
    background: "#f8f0e8",
    borderRadius: 4,
    padding: "12px 12px 52px",
    cursor: "pointer",
    transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.35s ease",
    position: "relative",
    width: 185,
    flexShrink: 0,
    animation: "polaroidIn 0.6s ease forwards",
    opacity: 0,
    animationFillMode: "forwards",
  },
  tape: {
    position: "absolute",
    top: -10,
    left: "50%",
    transform: "translateX(-50%)",
    width: 50,
    height: 20,
    borderRadius: 3,
    opacity: 0.6,
    zIndex: 2,
  },
  photoBox: {
    width: "100%",
    aspectRatio: "1",
    overflow: "hidden",
    position: "relative",
    borderRadius: 2,
    background: "#e0d0c0",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3))",
    borderRadius: 2,
  },
  viewOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "opacity 0.3s ease",
    borderRadius: 2,
  },
  viewIcon: { fontSize: 28 },
  viewText: {
    color: "white",
    fontSize: 11,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 500,
    letterSpacing: 1,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "10px 10px 12px",
    textAlign: "center",
    background: "#f8f0e8",
    borderRadius: "0 0 4px 4px",
  },
  bottomCaption: {
    fontFamily: "'Caveat', cursive",
    fontSize: 13,
    color: "#4a3030",
    marginBottom: 3,
    lineHeight: 1.3,
  },
  heartLine: {
    fontSize: 10,
    letterSpacing: 3,
    opacity: 0.7,
  },
};

// ─── Slideshow strip styles ───────────────────────────────────────────────────
const strip = {
  wrap: {
    width: "100%",
    maxWidth: 700,
    marginBottom: 32,
    overflow: "hidden",
    position: "relative",
  },
  label: {
    color: "rgba(255,180,200,0.5)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
    textAlign: "center",
  },
  track: {
    display: "flex",
    gap: 10,
    animation: "slideStrip 18s linear infinite",
    width: "max-content",
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
    cursor: "pointer",
    border: "1px solid rgba(255,150,170,0.2)",
    position: "relative",
    transition: "transform 0.2s",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  thumbOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    transition: "opacity 0.2s",
  },
};

// ─── Lightbox styles ──────────────────────────────────────────────────────────
const lb = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.92)",
    backdropFilter: "blur(16px)",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    cursor: "pointer",
  },
  bgGlow: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    transition: "background 0.5s ease",
  },
  card: {
    position: "relative",
    background: "rgba(15,8,25,0.95)",
    border: "1px solid rgba(255,150,180,0.15)",
    borderRadius: 20,
    overflow: "hidden",
    maxWidth: 480,
    width: "100%",
    boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,80,130,0.1)",
    animation: "lbFadeIn 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards",
    zIndex: 1,
    cursor: "default",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,200,215,0.8)",
    width: 34,
    height: 34,
    borderRadius: "50%",
    fontSize: 14,
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s",
  },
  arrowLeft: {
    position: "absolute",
    left: 14,
    top: "42%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    width: 38,
    height: 38,
    borderRadius: "50%",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s",
    lineHeight: 1,
  },
  arrowRight: {
    position: "absolute",
    right: 14,
    top: "42%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    width: 38,
    height: 38,
    borderRadius: "50%",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s",
    lineHeight: 1,
  },
  photoWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "4/3",
    overflow: "hidden",
  },
  photoGlow: {
    position: "absolute",
    inset: "-20%",
    zIndex: 0,
    pointerEvents: "none",
    filter: "blur(40px)",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    position: "relative",
    zIndex: 1,
  },
  grain: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    zIndex: 2,
    pointerEvents: "none",
    opacity: 0.5,
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
    zIndex: 3,
    pointerEvents: "none",
  },
  nowPlaying: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px 0 0",
    background: "rgba(15,8,25,0.95)",
  },
  musicIcon: {
    fontSize: 14,
    animation: "musicPulse 1.5s ease-in-out infinite",
    display: "inline-block",
  },
  nowPlayingText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 11,
    color: "rgba(255,180,200,0.6)",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  captionArea: {
    padding: "14px 24px 24px",
    textAlign: "center",
    background: "linear-gradient(to bottom, rgba(15,8,25,0) 0%, rgba(15,8,25,0.98) 100%)",
  },
  captionHeart: {
    fontSize: 20,
    marginBottom: 8,
    animation: "heartBeat 1.5s ease infinite",
    display: "inline-block",
  },
  captionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    color: "#ffccd5",
    marginBottom: 8,
    fontWeight: 600,
    textShadow: "0 0 16px rgba(255,180,200,0.5)",
  },
  captionNote: {
    fontFamily: "'Caveat', cursive",
    fontSize: 16,
    color: "rgba(255,210,225,0.75)",
    marginBottom: 16,
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  dotsRow: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
  },
  lbDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "all 0.3s",
    cursor: "pointer",
  },
  nowPlaying: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: "9px 0 2px",
    background: "rgba(15,8,25,0.98)",
  },
  musicNote: {
    fontSize: 13,
    display: "inline-block",
    animation: "musicPulse 1.4s ease-in-out infinite",
  },
  nowPlayingText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 10,
    color: "rgba(255,170,195,0.65)",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  hint: {
    color: "rgba(255,180,200,0.3)",
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 18,
    zIndex: 1,
    textAlign: "center",
  },
};

// ─── Main page styles ─────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh", width: "100%", background: "#010006",
    display: "flex", flexDirection: "column", alignItems: "center",
    position: "relative", overflow: "hidden", fontFamily: "'Outfit', sans-serif",
  },
  cursorGlow: {
    position: "fixed", width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,80,130,0.08) 0%, transparent 70%)",
    transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 5,
    transition: "left 0.3s ease, top 0.3s ease",
    animation: "cursorGlowAnim 3s ease-in-out infinite",
  },
  skyBase: {
    position: "fixed", inset: 0,
    background: "radial-gradient(ellipse 160% 100% at 50% -10%, #0c0020 0%, #040012 40%, #010008 70%, #000005 100%)",
    zIndex: 0,
  },
  skyMid: {
    position: "fixed", inset: 0,
    background: "radial-gradient(ellipse 100% 60% at 50% 110%, #1a0010 0%, #0a0005 40%, transparent 70%)",
    zIndex: 0,
  },
  skyHorizon: {
    position: "fixed", bottom: 0, left: 0, right: 0, height: "30%",
    background: "linear-gradient(to top, rgba(40,5,20,0.4) 0%, transparent 100%)",
    zIndex: 0,
  },
  nebula1: {
    position: "fixed", top: "-5%", left: "-5%", width: 800, height: 550,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(80,15,130,0.22) 0%, rgba(40,5,80,0.1) 50%, transparent 70%)",
    filter: "blur(60px)", animation: "nebulaDrift 25s ease-in-out infinite",
    zIndex: 0, pointerEvents: "none",
  },
  nebula2: {
    position: "fixed", top: "20%", right: "-10%", width: 700, height: 500,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(150,15,60,0.18) 0%, rgba(100,8,40,0.08) 50%, transparent 70%)",
    filter: "blur(70px)", animation: "nebulaDrift 30s ease-in-out infinite reverse",
    zIndex: 0, pointerEvents: "none",
  },
  nebula3: {
    position: "fixed", bottom: "0%", left: "10%", width: 900, height: 400,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(15,20,120,0.18) 0%, rgba(10,10,80,0.08) 50%, transparent 70%)",
    filter: "blur(80px)", animation: "nebulaDrift 38s ease-in-out infinite",
    zIndex: 0, pointerEvents: "none",
  },
  nebula4: {
    position: "fixed", top: "50%", left: "30%", width: 600, height: 600,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(200,40,100,0.08) 0%, transparent 70%)",
    filter: "blur(90px)", animation: "nebulaDrift 20s ease-in-out infinite reverse",
    zIndex: 0, pointerEvents: "none",
  },
  nav: {
    width: "100%", maxWidth: 920,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "22px 28px", zIndex: 100, flexWrap: "wrap", gap: 12,
    borderBottom: "1px solid rgba(255,150,180,0.06)",
    backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.1)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: 8 },
  navLogoRing: { fontSize: 20, filter: "drop-shadow(0 0 6px rgba(255,107,138,0.7))", animation: "floatIcon 3s ease-in-out infinite" },
  navLogoText: { color: "#ffccd5", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, letterSpacing: 2, textShadow: "0 0 16px rgba(255,180,200,0.6)" },
  navLinks: { display: "flex", gap: 6, flexWrap: "wrap" },
  navBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,200,215,0.55)", padding: "7px 16px", borderRadius: 50,
    cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif",
    fontWeight: 400, letterSpacing: 0.5, transition: "all 0.25s",
    backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 5,
  },
  navBtnActive: {
    background: "rgba(255,77,109,0.15)", border: "1px solid rgba(255,77,109,0.4)",
    color: "#ffffff", boxShadow: "0 0 20px rgba(255,77,109,0.25), inset 0 1px 0 rgba(255,200,220,0.1)",
    textShadow: "0 0 8px rgba(255,180,200,0.5)",
  },
  navDot: { width: 5, height: 5, borderRadius: "50%", background: "#ff6b8a", boxShadow: "0 0 6px rgba(255,107,138,0.8)", flexShrink: 0 },
  main: {
    flex: 1, width: "100%", maxWidth: 880, padding: "30px 28px 100px",
    zIndex: 10, display: "flex", justifyContent: "center", alignItems: "flex-start",
  },
  page: {
    width: "100%", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center",
    paddingTop: 30, position: "relative",
  },
  glowCircle: {
    position: "absolute", width: 700, height: 700, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,60,100,0.08) 0%, rgba(120,20,80,0.04) 50%, transparent 70%)",
    pointerEvents: "none", animation: "glowPulse 6s ease-in-out infinite", zIndex: -1, top: "-100px",
  },
  glowCircle2: {
    position: "absolute", width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(80,40,200,0.07) 0%, transparent 70%)",
    pointerEvents: "none", animation: "glowPulse 8s ease-in-out infinite reverse", zIndex: -1, top: "50px", left: "-50px",
  },
  eyebrow: {
    color: "#ff8fab", fontSize: 11, letterSpacing: 5, textTransform: "uppercase",
    marginBottom: 20, fontWeight: 500,
    textShadow: "0 0 16px rgba(255,143,171,0.8), 0 0 32px rgba(255,100,140,0.4)",
    display: "flex", alignItems: "center", gap: 10, animation: "fadeInUp 0.6s ease forwards",
  },
  eyebrowLine: {
    display: "inline-block", width: 40, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(255,143,171,0.6))",
    animation: "lineExpand 0.8s ease forwards",
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,9vw,80px)",
    color: "#fff", lineHeight: 1.1, marginBottom: 8,
    textShadow: "0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(255,100,140,0.1)",
    animation: "fadeInUp 0.7s ease 0.1s forwards", opacity: 0, animationFillMode: "forwards",
  },
  subHeroLine: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,34px)",
    color: "rgba(255,204,213,0.85)", fontStyle: "italic", marginBottom: 32,
    textShadow: "0 0 20px rgba(255,180,200,0.5)",
    animation: "fadeInUp 0.7s ease 0.2s forwards", opacity: 0, animationFillMode: "forwards",
  },
  quotePara: {
    lineHeight: 2.4, maxWidth: 560, marginBottom: 40,
    animation: "fadeInUp 0.7s ease 0.3s forwards", opacity: 0, animationFillMode: "forwards",
  },
  word1: { display: "inline", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(16px,2.8vw,22px)", animation: "colorWord1 5s ease-in-out infinite", color: "#ff9de2" },
  word2: { display: "inline", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(16px,2.8vw,22px)", animation: "colorWord2 5s ease-in-out 1.6s infinite", color: "#a8edea" },
  word3: { display: "inline", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(16px,2.8vw,22px)", animation: "colorWord3 5s ease-in-out 3.2s infinite", color: "#c3b1e1" },
  nameGlow: {
    background: "linear-gradient(90deg,#ff6b8a,#ffb3c6,#ffe0ea,#ffb3c6,#ff6b8a)",
    backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    animation: "shimmer 4s linear infinite", fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic", filter: "drop-shadow(0 0 12px rgba(255,107,138,0.6))",
  },
  primaryBtn: {
    position: "relative", background: "linear-gradient(135deg,#ff3355,#ff6b8a,#ff85a1)",
    color: "#fff", border: "none", padding: "14px 32px", borderRadius: 50,
    fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
    fontWeight: 500, letterSpacing: 1, marginTop: 10,
    boxShadow: "0 6px 30px rgba(255,50,80,0.45), 0 0 60px rgba(255,50,80,0.15)",
    transition: "transform 0.2s, box-shadow 0.2s", overflow: "hidden",
    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
    animation: "fadeInUp 0.7s ease 0.4s forwards", opacity: 0, animationFillMode: "forwards",
  },
  btnGlow: {
    position: "absolute", inset: 0,
    background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",
    animation: "shimmer 2s linear infinite", borderRadius: 50,
  },
  scrollHint: {
    color: "rgba(255,180,200,0.35)", fontSize: 11, marginTop: 36, letterSpacing: 3,
    animation: "fadeInUp 0.7s ease 0.5s forwards", opacity: 0, animationFillMode: "forwards",
  },
  floatHeart1: { position: "absolute", top: "15%", left: "5%", fontSize: 24, animation: "floatIcon 4s ease-in-out infinite", opacity: 0.4, filter: "drop-shadow(0 0 8px rgba(255,100,150,0.6))", pointerEvents: "none" },
  floatHeart2: { position: "absolute", top: "30%", right: "6%", fontSize: 20, animation: "floatIcon 5s ease-in-out 1s infinite", opacity: 0.3, filter: "drop-shadow(0 0 6px rgba(255,220,100,0.5))", pointerEvents: "none" },
  floatHeart3: { position: "absolute", bottom: "20%", left: "8%", fontSize: 22, animation: "floatIcon 6s ease-in-out 2s infinite", opacity: 0.35, filter: "drop-shadow(0 0 7px rgba(255,100,100,0.5))", pointerEvents: "none" },
  pageTitle: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,6vw,52px)",
    color: "#fff", marginBottom: 10, lineHeight: 1.2,
    textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(255,100,140,0.15)",
    animation: "fadeInUp 0.6s ease 0.1s forwards", opacity: 0, animationFillMode: "forwards",
  },
  gallerySubtitle: {
    color: "rgba(255,210,225,0.7)", fontSize: 15, lineHeight: 1.8, marginBottom: 28,
    animation: "fadeInUp 0.6s ease 0.2s forwards", opacity: 0, animationFillMode: "forwards",
  },
  galleryHint: {
    color: "rgba(255,150,180,0.6)", fontSize: 13, fontStyle: "italic",
  },
  cardsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))",
    gap: 14, width: "100%", maxWidth: 720, marginBottom: 36,
  },
  card: {
    border: "1px solid rgba(255,150,170,0.12)", borderRadius: 20, padding: "24px 18px",
    backdropFilter: "blur(14px)", textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,200,220,0.04)",
    animation: "fadeInUp 0.5s ease forwards", opacity: 0, animationFillMode: "forwards",
  },
  cardEmojiWrap: {
    width: 54, height: 54, borderRadius: "50%",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,180,200,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 12px", boxShadow: "0 0 16px rgba(255,100,140,0.1)",
  },
  cardEmoji: { fontSize: 26, filter: "drop-shadow(0 0 6px rgba(255,150,180,0.5))" },
  cardLabel: { fontFamily: "'Cormorant Garamond', serif", color: "#ffccd5", fontSize: 15, fontWeight: 700, marginBottom: 8, textShadow: "0 0 10px rgba(255,180,200,0.4)" },
  cardDesc: { color: "rgba(255,218,228,0.62)", fontSize: 12.5, lineHeight: 1.65 },
  ringContainer: { position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  ringGlow1: { position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "1px solid rgba(255,107,138,0.4)", animation: "ringPulse 2.5s ease-out infinite" },
  ringGlow2: { position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "1px solid rgba(255,107,138,0.3)", animation: "ringPulse 2.5s ease-out 0.8s infinite" },
  ringEmoji: { fontSize: 64, filter: "drop-shadow(0 0 20px rgba(255,107,138,0.8)) drop-shadow(0 0 40px rgba(255,50,100,0.4))", animation: "floatIcon 3s ease-in-out infinite" },
  proposalTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,6vw,54px)", color: "#fff", marginBottom: 20, lineHeight: 1.2, textShadow: "0 2px 20px rgba(0,0,0,0.9)" },
  proposalSub: { color: "rgba(255,215,228,0.78)", fontSize: "clamp(14px,2.5vw,17px)", lineHeight: 1.9, maxWidth: 500, marginBottom: 30, textShadow: "0 1px 8px rgba(0,0,0,0.9)" },
  noMsgWrap: { padding: "10px 24px", background: "rgba(255,107,138,0.08)", border: "1px solid rgba(255,107,138,0.2)", borderRadius: 50, marginBottom: 8, backdropFilter: "blur(8px)" },
  noMsg: { color: "#ff8fab", fontSize: 14, fontStyle: "italic", textShadow: "0 0 12px rgba(255,143,171,0.6)" },
  proposalButtons: { display: "flex", gap: 20, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: 10, position: "relative", minHeight: 110 },
  yesBtn: { position: "relative", background: "linear-gradient(135deg,#ff1744,#ff4d6d,#ff6b8a)", color: "#fff", border: "none", padding: "16px 40px", borderRadius: 50, fontSize: 17, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 700, boxShadow: "0 8px 40px rgba(255,23,68,0.6), 0 0 80px rgba(255,23,68,0.2)", animation: "pulse 2s infinite", letterSpacing: 1.5, textShadow: "0 1px 6px rgba(0,0,0,0.4)", overflow: "hidden" },
  yesBtnGlow: { position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)", animation: "shimmer 1.5s linear infinite", borderRadius: 50 },
  noBtn: { background: "rgba(40,40,50,0.5)", color: "rgba(160,160,170,0.55)", border: "1px solid rgba(100,100,110,0.2)", padding: "13px 28px", borderRadius: 50, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif", userSelect: "none", backdropFilter: "blur(8px)" },
  yesScreen: { display: "flex", flexDirection: "column", alignItems: "center", gap: 20 },
  yesRingWrap: { position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  yesRingPulse1: { position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,107,138,0.5)", animation: "ringPulse 1.8s ease-out infinite" },
  yesRingPulse2: { position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,107,138,0.35)", animation: "ringPulse 1.8s ease-out 0.6s infinite" },
  yesRingPulse3: { position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,107,138,0.2)", animation: "ringPulse 1.8s ease-out 1.2s infinite" },
  yesRingEmoji: { fontSize: 80, animation: "pulse 1s infinite", filter: "drop-shadow(0 0 30px rgba(255,107,138,0.9)) drop-shadow(0 0 60px rgba(255,50,100,0.4))" },
  yesTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,8vw,70px)", color: "#fff", lineHeight: 1.2, textShadow: "0 2px 30px rgba(0,0,0,0.9)" },
  yesSub: { color: "rgba(255,215,228,0.8)", fontSize: 17, lineHeight: 1.9, textShadow: "0 0 20px rgba(255,180,200,0.3)" },
  confettiRow: { marginTop: 8 },
  yesForever: { color: "#ffccd5", fontSize: 14, fontStyle: "italic", textShadow: "0 0 14px rgba(255,200,215,0.6)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: 1 },
  dots: { position: "fixed", bottom: 28, display: "flex", gap: 10, zIndex: 100 },
  dot: { width: 9, height: 9, borderRadius: "50%", cursor: "pointer", transition: "all 0.35s" },
};