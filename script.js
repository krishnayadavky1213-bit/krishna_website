/* ═══════════════════════════════════════════════════════════════
   YOUR EYES — A CINEMATIC LOVE STORY — script.js
   Vanilla JavaScript · No frameworks · All magic, no backend
═══════════════════════════════════════════════════════════════ */
"use strict";
// ── Wait for DOM ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  /* ═══════════════════════════════════════════════════════════
     1. LOADING SCREEN
  ═══════════════════════════════════════════════════════════ */
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    document.body.style.overflow = "auto";
    // Kick off all entry animations after load
    initHeroAnimations();
    // Auto-play music after loading
    startCustomMusic();
  }, 2800);
  document.body.style.overflow = "hidden";

  /* ═══════════════════════════════════════════════════════════
     2. CUSTOM CURSOR + MOUSE TRAIL
  ═══════════════════════════════════════════════════════════ */
  const cursor = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursor-trail");
  let mouseX = 0,
    mouseY = 0;
  let trailX = 0,
    trailY = 0;
  let heartInterval = null;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });
  // Smooth trailing cursor
  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top = trailY + "px";
    requestAnimationFrame(animateTrail);
  })();
  // Spawn tiny hearts on mouse move (throttled)
  let lastHeartTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastHeartTime < 120) return;
    lastHeartTime = now;
    spawnCursorHeart(e.clientX, e.clientY);
  });
  function spawnCursorHeart(x, y) {
    const el = document.createElement("div");
    el.className = "cursor-heart";
    el.textContent = "👁️";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.color = `hsl(${Math.random() * 60 + 320}, 100%, 70%)`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
  // Cursor scale on hover over interactive elements
  document
    .querySelectorAll("a, button, .reason-card, .story-card, .tl-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "32px";
        cursor.style.height = "32px";
        cursor.style.opacity = "0.6";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "16px";
        cursor.style.height = "16px";
        cursor.style.opacity = "1";
      });
    });

  /* ═══════════════════════════════════════════════════════════
     3. SCROLL PROGRESS BAR
  ═══════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById("scroll-progress");
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrolled / maxScroll) * 100 + "%";
    },
    { passive: true },
  );

  /* ═══════════════════════════════════════════════════════════
     4. NAVBAR SCROLL EFFECT
  ═══════════════════════════════════════════════════════════ */
  const navbar = document.getElementById("navbar");
  window.addEventListener(
    "scroll",
    () => {
      navbar.style.background =
        window.scrollY > 50 ? "rgba(5,5,16,0.92)" : "rgba(5,5,16,0.7)";
    },
    { passive: true },
  );

  /* ═══════════════════════════════════════════════════════════
     5. BACKGROUND CANVAS — STARS · EYES · FIREFLIES
  ═══════════════════════════════════════════════════════════ */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  // Stars
  const STAR_COUNT = 180;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.3,
    a: Math.random(),
    spd: Math.random() * 0.005 + 0.002,
    hue: Math.random() > 0.7 ? 280 + Math.random() * 60 : 0,
  }));
  // Floating eyes
  const PETAL_COUNT = 22;
  const petals = Array.from({ length: PETAL_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: Math.random() * 0.6 + 0.3,
    rot: Math.random() * Math.PI * 2,
    rotSpd: (Math.random() - 0.5) * 0.02,
    r: Math.random() * 6 + 4,
    a: Math.random() * 0.4 + 0.1,
  }));
  // Fireflies
  const FIREFLY_COUNT = 28;
  const fireflies = Array.from({ length: FIREFLY_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    a: 0,
    phase: Math.random() * Math.PI * 2,
    spd: Math.random() * 0.03 + 0.01,
  }));
  let t = 0;
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.016;
    // Stars
    stars.forEach((s) => {
      s.a += s.spd;
      const alpha = (Math.sin(s.a) + 1) / 2;
      const color = s.hue
        ? `hsla(${s.hue}, 80%, 80%, ${alpha * 0.8})`
        : `rgba(255,255,255,${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    // Floating eyes
    petals.forEach((p) => {
      p.x += p.vx + Math.sin(t + p.y * 0.01) * 0.3;
      p.y += p.vy;
      p.rot += p.rotSpd;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a * 0.3;
      // Draw eye shape
      ctx.font = `${p.r * 5}px serif`;
      ctx.fillStyle = "#ff6b9d";
      ctx.fillText("👁️", -p.r * 2.5, p.r * 2.5);
      ctx.restore();
      ctx.globalAlpha = 1;
    });
    // Fireflies
    fireflies.forEach((f) => {
      f.x += f.vx + Math.sin(t * 0.5 + f.phase) * 0.2;
      f.y += f.vy + Math.cos(t * 0.4 + f.phase) * 0.2;
      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;
      f.a = (Math.sin(t * f.spd * 60 + f.phase) + 1) / 2;
      const radius = 2 + f.a * 2;
      const gradient = ctx.createRadialGradient(
        f.x,
        f.y,
        0,
        f.x,
        f.y,
        radius * 5,
      );
      gradient.addColorStop(0, `rgba(255, 220, 100, ${f.a * 0.9})`);
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius * 5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();

  /* ═══════════════════════════════════════════════════════════
     6. SCROLL REVEAL
  ═══════════════════════════════════════════════════════════ */
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // Respect CSS animation-delay via --delay
          const delay =
            getComputedStyle(e.target).getPropertyValue("--delay") || "0s";
          const ms = parseFloat(delay) * 1000;
          setTimeout(() => e.target.classList.add("visible"), ms);
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  reveals.forEach((el) => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════
     7. HERO ANIMATIONS — TYPING + FLOATING EYES
  ═══════════════════════════════════════════════════════════ */
  function initHeroAnimations() {
    // Typing animation
    const typingEl = document.getElementById("typing-text");
    const text =
      "In your eyes, I found my universe… a galaxy of dreams I never want to escape.";
    let i = 0;
    typingEl.textContent = "";
    const typeTimer = setInterval(() => {
      if (i < text.length) {
        const char = text[i];
        // Use non-breaking space for spaces, and add word-wrap support
        typingEl.innerHTML +=
          char === " " ? "&nbsp;" : char === "\n" ? "<br>" : char;
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 55);
    // Floating eyes in hero
    const heroHearts = document.getElementById("hero-hearts");
    setInterval(() => spawnHeroHeart(heroHearts), 600);
  }
  function spawnHeroHeart(container) {
    const el = document.createElement("div");
    const emojis = ["👁️", "✨", "💫", "🌟", "👀", "💖"];
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      bottom: 0;
      font-size: ${Math.random() * 18 + 12}px;
      opacity: 0;
      pointer-events: none;
      animation: heroHeart ${Math.random() * 4 + 4}s ease-out ${Math.random() * 2}s forwards;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }
  // Inject hero heart keyframe
  const heroHrtStyle = document.createElement("style");
  heroHrtStyle.textContent = `
    @keyframes heroHeart {
      0% { opacity:0; transform: translateY(0) scale(0.5) rotate(${Math.random() * 20 - 10}deg); }
      15% { opacity:0.7; }
      100% { opacity:0; transform: translateY(-90vh) scale(1.2) rotate(${Math.random() * 40 - 20}deg); }
    }
  `;
  document.head.appendChild(heroHrtStyle);

  /* ═══════════════════════════════════════════════════════════
     8. STORY SECTION — SCENE EYES
  ═══════════════════════════════════════════════════════════ */
  const sceneHearts = document.getElementById("scene-hearts");
  const positions = [
    { left: "10%", top: "20%" },
    { left: "80%", top: "30%" },
    { left: "50%", top: "10%" },
    { left: "30%", top: "60%" },
    { left: "70%", top: "60%" },
  ];
  positions.forEach((pos, i) => {
    const el = document.createElement("div");
    el.className = "scene-heart-el";
    el.textContent = "👁️";
    el.style.left = pos.left;
    el.style.top = pos.top;
    el.style.animationDelay = `${i * 0.7}s`;
    el.style.color = `hsl(${Math.random() * 60 + 320}, 100%, 75%)`;
    sceneHearts.appendChild(el);
  });

  /* ═══════════════════════════════════════════════════════════
     9. DIALOGUE — YOUR EYES TYPING (FIXED TEXT WRAPPING)
  ═══════════════════════════════════════════════════════════ */
  const boyReply = document.getElementById("boy-reply");
  // Apply CSS fix for text wrapping
  if (boyReply) {
    boyReply.style.wordWrap = "break-word";
    boyReply.style.wordBreak = "break-word";
    boyReply.style.whiteSpace = "pre-wrap";
    boyReply.style.overflowWrap = "break-word";
    boyReply.style.maxWidth = "100%";
    boyReply.style.lineHeight = "1.6";
  }

  const boyText =
    "Your eyes hold mysteries that no words can explain. When I look into them, I see poetry, I see magic, I see forever. Every glance from you writes a new chapter in my soul.";
  let boyTyped = false;
  const boyObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !boyTyped) {
        boyTyped = true;
        let j = 0;
        boyReply.innerHTML = "";
        const typeTimer = setInterval(() => {
          if (j < boyText.length) {
            const char = boyText[j];
            boyReply.innerHTML +=
              char === " " ? "&nbsp;" : char === "\n" ? "<br>" : char;
            j++;
          } else {
            clearInterval(typeTimer);
          }
        }, 45);
        boyObs.disconnect();
      }
    },
    { threshold: 0.4 },
  );
  if (boyReply) boyObs.observe(boyReply);

  /* ═══════════════════════════════════════════════════════════
     10. DAYS COUNTER
  ═══════════════════════════════════════════════════════════ */
  /* ═══════════════════════════════════════════════════════════
   10. DAYS COUNTER — FIXED 300 DAYS
═══════════════════════════════════════════════════════════ */
  const daysEl = document.getElementById("days-count");

  if (daysEl) {
    daysEl.textContent = "300";
  }
  /* ═══════════════════════════════════════════════════════════
     11. PROMISE TEXT — SLOW REVEAL (FIXED TEXT WRAPPING)
  ═══════════════════════════════════════════════════════════ */
  const promiseEl = document.getElementById("promise-text");
  // Apply CSS fix for text wrapping
  if (promiseEl) {
    promiseEl.style.wordWrap = "break-word";
    promiseEl.style.wordBreak = "break-word";
    promiseEl.style.whiteSpace = "pre-wrap";
    promiseEl.style.overflowWrap = "break-word";
    promiseEl.style.maxWidth = "100%";
    promiseEl.style.lineHeight = "1.6";
  }

  const promiseFull =
    "Your eyes speak a language that my heart understands perfectly. In their depths, I discovered what forever looks like. Every blink is a promise, every gaze is a gift, and every time you look at me, I fall deeper into the beautiful mystery that is you.";
  let promiseDone = false;
  const promObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !promiseDone) {
        promiseDone = true;
        let k = 0;
        promiseEl.innerHTML = "";
        const typeTimer = setInterval(() => {
          if (k < promiseFull.length) {
            const char = promiseFull[k];
            promiseEl.innerHTML +=
              char === " " ? "&nbsp;" : char === "\n" ? "<br>" : char;
            k++;
          } else {
            clearInterval(typeTimer);
          }
        }, 30);
        promObs.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  if (promiseEl) promObs.observe(promiseEl);

  /* ═══════════════════════════════════════════════════════════
     12. 3D TILT ON REASON CARDS
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * -14;
      const ry = ((e.clientX - cx) / rect.width) * 14;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ═══════════════════════════════════════════════════════════
     13. AUTO-PLAY MUSIC PLAYER — ADD YOUR OWN AUDIO FILE
  ═══════════════════════════════════════════════════════════ */
  let customAudio = null;
  let isCustomPlaying = false;
  const playBtn = document.getElementById("play-btn");
  const volSlider = document.getElementById("volume-slider");
  const vizBars = document.querySelectorAll(".viz-bar");

  // 🎵 ADD YOUR MUSIC HERE 🎵
  // Option 1: Local file (put your music file in the same folder)
  const MUSIC_FILE = "audio.files.mp4";

  // Option 2: Online URL
  // const MUSIC_FILE = 'https://www.tiktok.com/@tulsi_448/video/7630770492483325191?is_from_webapp=1&sender_device=pc&web_id=7611138251562878482'; // 👈 Or use a URL

  function createCustomAudio() {
    if (customAudio) return;

    customAudio = new Audio();
    customAudio.src = MUSIC_FILE;
    customAudio.loop = true; // 🔄 This makes the song loop forever
    customAudio.volume = parseFloat(volSlider.value) || 0.5;

    // Error handling for music file
    customAudio.addEventListener("error", (e) => {
      console.log("💔 Music file not found. Falling back to synth music.");
      console.log("👉 Add your music file as: " + MUSIC_FILE);
      console.log("   Or update the MUSIC_FILE variable above.");
      // Fall back to synthesized music
      fallbackToSynthMusic();
    });

    // When music starts playing
    customAudio.addEventListener("play", () => {
      isCustomPlaying = true;
      playBtn.textContent = "⏸ Pause";
      playBtn.classList.add("playing");
      vizBars.forEach((b) => b.classList.add("playing"));
      setupAudioVisualizer();
    });

    // When music is paused
    customAudio.addEventListener("pause", () => {
      isCustomPlaying = false;
      playBtn.textContent = "▶ Play";
      playBtn.classList.remove("playing");
      vizBars.forEach((b) => {
        b.classList.remove("playing");
        b.style.animation = "";
      });
    });

    // Setup visualizer
    setupAudioVisualizer();
  }

  function setupAudioVisualizer() {
    // Simple beat-like visualizer animation
    if (isCustomPlaying) {
      vizBars.forEach((bar, i) => {
        bar.style.animation = `viz-bar-anim ${0.6 + i * 0.15}s ease-in-out infinite alternate`;
        bar.style.animationDelay = `${i * 0.1}s`;
      });
    }
  }

  function startCustomMusic() {
    createCustomAudio();

    // Try to autoplay
    const playPromise = customAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("🎵 Music playing automatically");
          isCustomPlaying = true;
          playBtn.textContent = "⏸ Pause";
          playBtn.classList.add("playing");
          vizBars.forEach((b) => b.classList.add("playing"));
          setupAudioVisualizer();
        })
        .catch((err) => {
          console.log("⚠️ Autoplay blocked. Click play button to start music.");
          console.log("Error:", err);
          // Show a play hint
          isCustomPlaying = false;
          playBtn.textContent = "▶ Play";
          playBtn.classList.remove("playing");

          // Add click listener to document for first interaction
          const playOnFirstClick = () => {
            if (!isCustomPlaying) {
              startCustomMusic();
              document.removeEventListener("click", playOnFirstClick);
            }
          };
          document.addEventListener("click", playOnFirstClick, { once: true });
        });
    }
  }

  function stopCustomMusic() {
    if (customAudio) {
      customAudio.pause();
      isCustomPlaying = false;
      playBtn.textContent = "▶ Play";
      playBtn.classList.remove("playing");
      vizBars.forEach((b) => {
        b.classList.remove("playing");
        b.style.animation = "";
      });
    }
  }

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent document click handler
    if (isCustomPlaying) {
      stopCustomMusic();
    } else {
      startCustomMusic();
    }
  });

  volSlider.addEventListener("input", (e) => {
    if (customAudio) {
      customAudio.volume = parseFloat(e.target.value);
    }
  });

  // Fallback to synthesized music if no audio file found
  function fallbackToSynthMusic() {
    console.log("🎹 Playing synthesized music instead...");
    initSynthMusic();
    // Auto-start synth music
    setTimeout(() => {
      startSynthMusic();
    }, 1000);
  }

  /* ═══════════════════════════════════════════════════════════
     13-B. FALLBACK: WEB AUDIO API SYNTHESIZER
  ═══════════════════════════════════════════════════════════ */
  let audioCtx = null;
  let masterGain = null;
  let isSynthPlaying = false;
  let scheduleTimeout = null;

  const chordProgression = [
    [220.0, 261.63, 329.63], // Am (A3, C4, E4)
    [174.61, 220.0, 261.63], // F (F3, A3, C4)
    [130.81, 164.81, 196.0], // C (C3, E3, G3)
    [196.0, 246.94, 293.66], // G (G3, B3, D4)
  ];

  const melodyNotes = [
    440, 392, 349.23, 329.63, 293.66, 329.63, 392, 440, 493.88, 440, 392,
    349.23, 392, 349.23, 329.63, 293.66,
  ];

  function initSynthMusic() {
    // Override play button for synth
    playBtn.removeEventListener("click", toggleCustomMusic);
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isSynthPlaying) {
        stopSynthMusic();
      } else {
        startSynthMusic();
      }
    });
  }

  // Store original click handler
  function toggleCustomMusic(e) {
    e.stopPropagation();
    if (isCustomPlaying) {
      stopCustomMusic();
    } else {
      startCustomMusic();
    }
  }

  function createSynthAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);
  }

  function playNote(
    freq,
    startTime,
    duration,
    gainVal,
    type = "sine",
    detune = 0,
  ) {
    if (!audioCtx) return null;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(
      gainVal * 0.4,
      startTime + duration * 0.6,
    );
    gain.gain.linearRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
    return osc;
  }

  function scheduleSynthMusic() {
    if (!audioCtx || !isSynthPlaying) return;
    if (scheduleTimeout) clearTimeout(scheduleTimeout);

    const now = audioCtx.currentTime;
    const beatDur = 1.8;

    chordProgression.forEach((chord, chordIdx) => {
      const chordStart = now + chordIdx * beatDur * 2;
      chord.forEach((freq) => {
        playNote(freq, chordStart, beatDur * 2, 0.08, "triangle", 0);
        playNote(freq, chordStart, beatDur * 2, 0.04, "sine", 5);
      });
    });

    melodyNotes.forEach((note, i) => {
      const noteStart = now + i * beatDur * 0.5;
      playNote(note, noteStart, beatDur * 0.45, 0.12, "sine", 0);
      playNote(note, noteStart + 0.05, beatDur * 0.45, 0.04, "sine", 3);
    });

    [110, 87.31, 65.41, 98].forEach((bass, i) => {
      playNote(bass, now + i * beatDur * 2, beatDur * 2, 0.09, "sine", 0);
    });

    const loopDuration = chordProgression.length * beatDur * 2;
    scheduleTimeout = setTimeout(
      () => {
        if (isSynthPlaying) scheduleSynthMusic();
      },
      (loopDuration - 0.3) * 1000,
    );
  }

  function startSynthMusic() {
    createSynthAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    isSynthPlaying = true;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(
      parseFloat(volSlider.value) || 0.5,
      audioCtx.currentTime + 1.5,
    );
    scheduleSynthMusic();
    playBtn.textContent = "⏸ Pause";
    playBtn.classList.add("playing");
    vizBars.forEach((b) => b.classList.add("playing"));
  }

  function stopSynthMusic() {
    isSynthPlaying = false;
    if (scheduleTimeout) {
      clearTimeout(scheduleTimeout);
      scheduleTimeout = null;
    }
    if (audioCtx && masterGain) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.8,
      );
    }
    playBtn.textContent = "▶ Play";
    playBtn.classList.remove("playing");
    vizBars.forEach((b) => b.classList.remove("playing"));
  }

  /* ═══════════════════════════════════════════════════════════
     14. ENDING SECTION — SLOW TEXT REVEAL (FIXED WRAPPING)
  ═══════════════════════════════════════════════════════════ */
  const endingLine = document.getElementById("ending-line");
  // Apply CSS fix for text wrapping
  if (endingLine) {
    endingLine.style.wordWrap = "break-word";
    endingLine.style.wordBreak = "break-word";
    endingLine.style.whiteSpace = "pre-wrap";
    endingLine.style.overflowWrap = "break-word";
    endingLine.style.maxWidth = "100%";
    endingLine.style.lineHeight = "1.6";
  }

  const endingText =
    "In your eyes, I found my home… and I never want to leave 👁️✨";
  let endingDone = false;
  const endObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !endingDone) {
        endingDone = true;
        typeSlowly(endingLine, endingText, 70);
        endObs.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  if (endingLine) endObs.observe(endingLine);

  function typeSlowly(el, text, speed) {
    let i = 0;
    el.innerHTML = "";
    const typeTimer = setInterval(() => {
      if (i < text.length) {
        const char = text[i];
        el.innerHTML += char === " " ? "&nbsp;" : char === "\n" ? "<br>" : char;
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, speed);
  }

  /* ═══════════════════════════════════════════════════════════
     15. "WILL YOU STAY?" BUTTON — HEART EXPLOSION
  ═══════════════════════════════════════════════════════════ */
  const stayBtn = document.getElementById("stay-btn");
  const finalMessage = document.getElementById("final-message");
  const finalHearts = document.getElementById("final-hearts");

  stayBtn.addEventListener("click", () => {
    // Explode hearts
    for (let i = 0; i < 40; i++) {
      setTimeout(() => explodeHeart(), i * 60);
    }
    // Show final message after short delay
    setTimeout(() => {
      finalMessage.classList.add("active");
      spawnFinalHearts();

      // Start music on click if not playing
      if (!isCustomPlaying && !isSynthPlaying) {
        startCustomMusic();
      }
    }, 800);

    // Close final message on click
    finalMessage.addEventListener("click", () => {
      finalMessage.classList.remove("active");
    });
  });

  function explodeHeart() {
    const el = document.createElement("div");
    el.className = "heart-particle";
    const emojis = ["👁️", "✨", "💫", "🌟", "👀", "💖"];
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${Math.random() * 100}vh`;
    el.style.fontSize = `${Math.random() * 28 + 14}px`;
    el.style.animationDuration = `${Math.random() * 1 + 1}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function spawnFinalHearts() {
    const heart = () => {
      const el = document.createElement("div");
      const emojis = ["👁️", "✨", "💫", "🌟", "👀"];
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: 0;
        font-size: ${Math.random() * 24 + 12}px;
        pointer-events: none;
        animation: finalHeartRise ${Math.random() * 5 + 4}s ease-out ${Math.random() * 3}s both;
      `;
      finalHearts.appendChild(el);
      setTimeout(() => el.remove(), 10000);
    };

    const style = document.createElement("style");
    style.textContent = `
      @keyframes finalHeartRise {
        0% { opacity:0; transform: translateY(0) scale(0.5); }
        15% { opacity:1; }
        100% { opacity:0; transform: translateY(-95vh) scale(1.3) rotate(${Math.random() * 30 - 15}deg); }
      }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 30; i++) {
      setTimeout(heart, i * 200);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     16. FLOATING LOVE QUOTES (Random, ambient)
  ═══════════════════════════════════════════════════════════ */
  const quotes = [
    '"Your eyes are the stars that guide me home."',
    '"In your gaze, I found my forever."',
    '"Every time you blink, an angel finds its wings."',
    '"Your eyes hold the poetry my heart always wanted to read."',
    '"I looked into your eyes and found my universe."',
    '"Your eyes whisper secrets that only my heart can hear."',
    '"Behind your eyes, I discovered what love truly means."',
    '"Your eyes make every moment feel like magic."',
  ];

  function spawnFloatingQuote() {
    const el = document.createElement("div");
    el.className = "float-quote";
    el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    el.style.left = `${Math.random() * 80 + 5}%`;
    el.style.bottom = "0";
    el.style.animationDuration = `${Math.random() * 8 + 10}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 18000);
  }

  setInterval(spawnFloatingQuote, 6000);
  setTimeout(spawnFloatingQuote, 5000);

  /* ═══════════════════════════════════════════════════════════
     17. DYNAMIC GREETING TEXT
  ═══════════════════════════════════════════════════════════ */
  const hour = new Date().getHours();
  const greeting =
    hour < 5
      ? "🌙 Your eyes in my dreams…"
      : hour < 12
        ? "☀️ Morning light in your eyes…"
        : hour < 17
          ? "🌤️ Afternoon sparkle in your eyes…"
          : hour < 21
            ? "🌇 Evening glow in your eyes…"
            : "🌙 Starlight in your eyes…";
  const badge = document.querySelector(".hero-badge");
  if (badge) badge.textContent = `✦ ${greeting} ✦`;

  /* ═══════════════════════════════════════════════════════════
     18. NIGHT SKY STARS for ENDING SECTION
  ═══════════════════════════════════════════════════════════ */
  const nightSky = document.getElementById("night-sky");
  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: white;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.7 + 0.1};
      animation: star-twinkle ${Math.random() * 4 + 2}s ease-in-out ${Math.random() * 4}s infinite alternate;
    `;
    nightSky.appendChild(star);
  }

  const starTwinkle = document.createElement("style");
  starTwinkle.textContent = `
    @keyframes star-twinkle {
      from { opacity: 0.1; transform: scale(0.8); }
      to { opacity: 0.9; transform: scale(1.2); }
    }
  `;
  document.head.appendChild(starTwinkle);

  /* ═══════════════════════════════════════════════════════════
     19. SMOOTH SECTION TRANSITIONS — subtle parallax
  ═══════════════════════════════════════════════════════════ */
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      const heroContent = document.querySelector(".hero-content");
      if (heroContent && scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroContent.style.opacity = `${1 - (scrollY / window.innerHeight) * 1.2}`;
      }
    },
    { passive: true },
  );

  /* ═══════════════════════════════════════════════════════════
     20. CONSOLE LOVE MESSAGE
  ═══════════════════════════════════════════════════════════ */
  console.log(
    "%c👁️ Your Eyes — A Cinematic Love Story",
    "color:#ff6b9d;font-family:Georgia,serif;font-size:22px;font-style:italic;",
  );
  console.log(
    "%cMade with pure vanilla JS, CSS animations, and all the love in the world.",
    "color:#b06fff;font-size:13px;",
  );
  console.log(
    '%c"In your eyes, I found my universe."',
    "color:#ffd700;font-size:14px;font-style:italic;",
  );

  /* ═══════════════════════════════════════════════════════════
     21. CLEANUP ON PAGE UNLOAD
  ═══════════════════════════════════════════════════════════ */
  window.addEventListener("beforeunload", () => {
    if (customAudio) {
      customAudio.pause();
      customAudio = null;
    }
    if (scheduleTimeout) clearTimeout(scheduleTimeout);
    if (audioCtx) {
      audioCtx.close();
    }
    isSynthPlaying = false;
    isCustomPlaying = false;
  });
}); // end DOMContentLoaded
