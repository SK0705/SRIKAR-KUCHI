/* ==========================================================
   Portfolio JS — FIXED Resume Download + Full System
   Author: Venkata Sai Srikar Kuchi
   ========================================================== */

/* =======================
   GLOBAL VOICE SYSTEM
======================= */
window.systemSpeak = function (text) {
  if (!window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 0.9;
  utter.rate = 1.05;

  const voices = synth.getVoices();
  utter.voice =
    voices.find(v => v.name.includes("Google") || v.name.includes("Microsoft")) ||
    voices[0];

  synth.speak(utter);
};

/* =======================
   HERO TYPEWRITER
======================= */
const heroTitle = document.querySelector(".hero-content-center h2");
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = "";
  let i = 0;
  setTimeout(function type() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i++);
      setTimeout(type, 80);
    }
  }, 800);
}

/* =======================
   INTERSECTION ANIMATIONS
======================= */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("animate-in");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll("section").forEach(s => observer.observe(s));

/* =======================
   SMOOTH SCROLL
======================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

/* =======================
   RESUME DOWNLOAD (CLICK)
======================= */
document.querySelectorAll(".resume-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!btn.href) return;
    btn.classList.add("downloading");
    setTimeout(() => btn.classList.remove("downloading"), 1200);
  });
});

/* =======================
   V.E.C.T.O.R VOICE SYSTEM
======================= */
(function () {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const speak = window.systemSpeak;

  document.getElementById("vector-btn")?.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = e => {
    const command = e.results[0][0].transcript.toLowerCase();

    /* =======================
       RESUME DOWNLOAD (VOICE)
    ======================= */
    if (command.includes("download") && command.includes("resume")) {
      const resumes = Array.from(document.querySelectorAll(".resume-btn"));
      let target = null;

      if (command.includes("it") || command.includes("tech"))
        target = resumes.find(r => r.dataset.resume === "it");
      else if (command.includes("finance") || command.includes("account"))
        target = resumes.find(r => r.dataset.resume === "finance");
      else if (command.includes("bpo") || command.includes("support"))
        target = resumes.find(r => r.dataset.resume === "bpo");
      else if (command.includes("edutech") || command.includes("education"))
        target = resumes.find(r => r.dataset.resume === "edutech");
      else target = resumes[0];

      if (target && target.href) {
        speak("Secure file located. Initiating download.");
        window.open(target.href, "_self");
      } else {
        speak("Resume file not found.");
      }
      return;
    }

    /* =======================
       BASIC NAV COMMANDS
    ======================= */
    if (command.includes("home")) {
      speak("Returning to home.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (command.includes("project")) {
      speak("Opening projects.");
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    } else if (command.includes("contact")) {
      speak("Opening contact channel.");
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      speak("Command not recognized.");
    }
  };

  recognition.onerror = () => speak("Voice system error.");
})();

/* =======================
   STARTUP SOUND
======================= */
window.addEventListener("load", () => {
  const audio = document.getElementById("startup-sound");
  audio?.play().catch(() => {});
});
