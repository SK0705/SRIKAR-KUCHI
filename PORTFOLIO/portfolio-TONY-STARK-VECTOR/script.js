/* ==========================================================
   Portfolio JS — Smooth scroll, lightbox, contact tools & form submit
   Author: Venkata Sai Srikar Kuchi
   ========================================================== */

// Global Voice System
window.systemSpeak = function(text, callback) {
  if (!window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.9; 
  utterance.rate = 1.1; 
  
  const voices = synth.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David')) || voices[0];
  if (preferredVoice) utterance.voice = preferredVoice;
  
  synth.speak(utterance);
};

// Typing effect for hero title
const heroTitle = document.querySelector('.hero-content-center h2');
const originalText = heroTitle.textContent;
heroTitle.textContent = '';
let i = 0;
function typeWriter() {
  if (i < originalText.length) {
    heroTitle.textContent += originalText.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
setTimeout(typeWriter, 1000);

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) {
        // Visual transition effect
        document.body.classList.add('section-switching');
        setTimeout(() => {
          el.scrollIntoView({behavior:'smooth', block:'start'});
          setTimeout(() => document.body.classList.remove('section-switching'), 600);
        }, 100);
      }
    }
  });
});

// Lightbox for project images (click to zoom)
document.querySelectorAll('.preview-media img').forEach(img=>{
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', ()=>{
    const light = document.createElement('div');
    light.style.position = 'fixed';
    light.style.inset = '0';
    light.style.background = 'rgba(0,0,0,0.9)';
    light.style.display = 'flex';
    light.style.alignItems = 'center';
    light.style.justifyContent = 'center';
    light.style.zIndex = '1200';
    light.style.backdropFilter = 'blur(6px)';

    const big = document.createElement('img');
    big.src = img.src;
    big.alt = img.alt || 'Project image';
    big.style.maxWidth = '95%';
    big.style.maxHeight = '95%';
    big.style.borderRadius = '12px';
    big.style.boxShadow = '0 40px 120px rgba(0,0,0,0.8)';
    big.style.transition = 'transform .4s ease';
    big.style.transform = 'scale(1.03)';

    const fadeIn = () => { big.style.transform = 'scale(1)'; };
    setTimeout(fadeIn, 50);

    // Close on click or ESC
    light.addEventListener('click', ()=>document.body.removeChild(light));
    const escHandler = e=>{
      if(e.key === 'Escape' && document.body.contains(light)){
        document.body.removeChild(light);
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);

    light.appendChild(big);
    document.body.appendChild(light);
  });
});

// Contact section: copy-to-clipboard buttons
(function(){
  const toast = document.getElementById('copyToast');
  document.querySelectorAll('.contact-btn[data-copy]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(()=>{
        // show animated toast
        if(toast){
          toast.hidden = false;
          toast.classList.add('show');
          setTimeout(()=>{
            toast.classList.remove('show');
            setTimeout(()=> toast.hidden = true, 300);
          }, 2500);
        }
        // visual pulse on button
        btn.animate([
          { transform:'scale(1)', backgroundPosition:'0% 50%' },
          { transform:'scale(1.05)', backgroundPosition:'100% 50%' },
          { transform:'scale(1)', backgroundPosition:'0% 50%' }
        ], {duration:500, easing:'ease'});
      });
    });
  });
})();

// Contact form: send via Web3Forms and show custom toast
(function(){
  const form = document.getElementById('form');
  if (!form) return; // no form on this page

  const submitBtn = form.querySelector('button[type="submit"]');

  function showFormToast(type, message){
    const toast = document.getElementById('formToast');
    if (!toast) {
      // Fallback if HTML not present
      alert(message);
      return;
    }

    const textEl = toast.querySelector('.form-toast-text');
    if (textEl) textEl.textContent = message;

    // reset classes
    toast.classList.remove('success', 'error', 'show');
    toast.hidden = false;

    // type = "success" | "error"
    toast.classList.add(type);

    // trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // hide after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 250);
    }, 2600);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    // Your Web3Forms access key
    formData.append("access_key", "20d79819-1882-4c17-96ec-051372891390");

    const originalText = submitBtn ? submitBtn.textContent : 'Send Message';

    if (submitBtn) {
      submitBtn.textContent = "TRANSMITTING...";
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (submitBtn) submitBtn.classList.remove('loading');

      if (response.ok) {
        showFormToast("success", "Message transmitted successfully.");
        form.reset();
        if (submitBtn) {
          submitBtn.textContent = "TRANSMISSION COMPLETE";
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2500);
        }
      } else {
        showFormToast("error", data.message || "Transmission failed.");
        if (submitBtn) {
          submitBtn.textContent = "RETRY";
          submitBtn.disabled = false;
        }
      }

    } catch (error) {
      if (submitBtn) submitBtn.classList.remove('loading');
      showFormToast("error", "Network anomaly detected.");
      if (submitBtn) {
        submitBtn.textContent = "SYSTEM ERROR";
        submitBtn.disabled = false;
      }
    }
  });
})();

/* ==========================================================
   3D Tilt Effect for Cards (Stark Tech Interface)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const tiltCards = document.querySelectorAll('.preview-card, .skill-group, .contact-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Disable tilt on mobile/tablet to prevent scrolling interference
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation (max +/- 5 to 8 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
});

/* ==========================================================
   V.E.C.T.O.R. Voice Command System
   ========================================================== */
(function() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const vectorBtn = document.getElementById('vector-btn');
  const vectorStatus = document.getElementById('vector-status');
  
  // Hide interface if speech recognition is not supported
  if (!SpeechRecognition) {
    if(vectorBtn) {
      vectorBtn.style.display = 'none';
      if(vectorStatus) vectorStatus.style.display = 'none';
    }
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isListening = false;
  let flightInterval;
  let breachTimeout;
  let destructInterval;
  let formInteractionState = null;

  // Helper for mode switching sound
  const playModeSound = () => {
    const audio = document.getElementById('mode-sound');
    if(audio) {
      audio.currentTime = 0;
      audio.play().catch(e=>{});
    }
  };

  function startFlightMode() {
    document.body.classList.add('flight-mode');
    playModeSound();
    speak("Flight systems engaged. Initiating flyover sequence.");

    // If already near bottom, scroll to top first
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if(flightInterval) clearInterval(flightInterval);
    // Stop flight on any direct user interaction (wheel, touch, mouse, key)
    const cancelOnInteraction = () => { stopFlightMode(); speak("Flight mode interrupted by user."); };
    ['wheel','touchstart','mousedown','keydown'].forEach(ev => {
      window.addEventListener(ev, cancelOnInteraction, { passive: true });
    });

    // Store a reference so we can remove these listeners when stopping
    startFlightMode._cancelHandlers = cancelOnInteraction;

    flightInterval = setInterval(() => {
      // Use small smooth increments for a gentle flyover
      window.scrollBy(0, 3);
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5) {
        stopFlightMode();
        speak("Flyover complete. Re-engaging hover thrusters.");
      }
    }, 16);
  }

  function stopFlightMode() {
    document.body.classList.remove('flight-mode');
    if(flightInterval) clearInterval(flightInterval);
    // Remove any interaction listeners added during start
    if (startFlightMode._cancelHandlers) {
      ['wheel','touchstart','mousedown','keydown'].forEach(ev => {
        window.removeEventListener(ev, startFlightMode._cancelHandlers);
      });
      startFlightMode._cancelHandlers = null;
    }
  }

  function performSystemScan() {
    speak("Initiating system scan. Identifying interactive nodes.");
    const targets = document.querySelectorAll('a, button, input, textarea, .preview-card, .edu-card, .skill-group');
    targets.forEach(el => el.classList.add('scan-active'));
    
    setTimeout(() => {
      targets.forEach(el => el.classList.remove('scan-active'));
    }, 3000);
  }

  function triggerSecurityBreach() {
    document.body.classList.add('security-breach');
    playModeSound();
    speak("WARNING. SECURITY BREACH DETECTED. UNAUTHORIZED ACCESS ATTEMPT TO CORE REPOSITORY. LOCKDOWN INITIATED.");
    
    if (breachTimeout) clearTimeout(breachTimeout);
    breachTimeout = setTimeout(() => {
      document.body.classList.remove('security-breach');
      speak("Threat neutralized. Systems returning to normal.");
    }, 5000);
  }

  function performSystemReboot() {
    speak("Initiating system reboot. Purging cache... Restarting core services.");
    const overlay = document.getElementById('reboot-overlay');
    const progress = overlay ? overlay.querySelector('.reboot-progress') : null;
    
    if(overlay) {
      overlay.classList.add('active');
      if(progress) {
        setTimeout(() => { progress.style.width = '100%'; }, 100);
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } else {
      window.location.reload();
    }
  }

  function initiateSelfDestruct() {
    const overlay = document.getElementById('self-destruct-overlay');
    const timerEl = document.getElementById('destruct-timer');
    let count = 10;
    
    if(overlay) overlay.classList.add('active');
    speak("Self destruct sequence initiated. Detonation in 10 seconds.");
    
    if(destructInterval) clearInterval(destructInterval);

    destructInterval = setInterval(() => {
      count--;
      if(timerEl) timerEl.textContent = count;
      
      if(count <= 0) {
        clearInterval(destructInterval);
        speak("Goodbye.");
        setTimeout(() => {
          window.close();
          window.location.href = "about:blank";
        }, 1000);
      } else if (count <= 5) {
        speak(count.toString());
      }
    }, 1000);
  }

  const speak = window.systemSpeak;

  function updateStatus(text) {
    if(!vectorStatus) return;
    vectorStatus.textContent = text;
    vectorStatus.style.opacity = '1';
    vectorStatus.style.transform = 'translateY(0)';
  }

  vectorBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  recognition.onstart = () => {
    isListening = true;
    vectorBtn.classList.add('listening');
    updateStatus("V.E.C.T.O.R. LISTENING...");
  };

  recognition.onend = () => {
    isListening = false;
    vectorBtn.classList.remove('listening');
    setTimeout(() => {
      if(!isListening) updateStatus("V.E.C.T.O.R. STANDBY");
    }, 2000);
  };

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    updateStatus(`CMD: "${command}"`);

    // --- Project Launch Protocols ---
    const projects = {
      'finnatrix': {
        live: 'https://finamtrix-mvp.vercel.app/',
        repo: 'https://github.com/SK0705/finamtrix_mvp.git',
        triggers: ['finnatrix', 'finance', 'matrix']
      },
      'sj creative': {
        live: 'https://sjcreativelabs.vercel.app/',
        repo: 'https://github.com/SK0705/SJCREATIVELABS.git',
        triggers: ['sj', 'creative', 'labs']
      },
      'vector': {
        live: null, 
        repo: 'https://github.com/SK0705',
        triggers: ['vector', 'system', 'voice']
      }
    };

    // Check for specific project commands
    for (const [name, data] of Object.entries(projects)) {
      if (data.triggers.some(t => command.includes(t))) {
        if (command.includes('code') || command.includes('repo') || command.includes('git') || command.includes('source')) {
          if (name === 'vector') {
            triggerSecurityBreach();
            return;
          }
          if (data.repo) {
            speak(`Accessing source code for ${name}.`);
            window.open(data.repo, '_blank');
            return;
          }
        } else if (command.includes('live') || command.includes('deploy') || command.includes('open') || command.includes('launch') || command.includes('site')) {
          if (data.live) {
            speak(`Initializing deployment for ${name}.`);
            window.open(data.live, '_blank');
            return;
          }
        }
      }
    }
    
    // Command Processing
    if (command.includes('home') || command.includes('top') || command.includes('start')) {
      speak("Rerouting to surface level.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Priority Access Protocol (Executes irrespective of other logic if 'access' is detected)
    else if (command.includes('access')) {
      if (command.includes('linkedin')) {
        speak("Accessing professional network.");
        window.open('https://www.linkedin.com/in/srikar-kuchi/', '_blank');
      } else if (command.includes('github') || command.includes('git')) {
        speak("Accessing code repositories.");
        window.open('https://github.com/SK0705', '_blank');
      } else if (command.includes('instagram') || command.includes('insta')) {
        speak("Accessing social feed.");
        window.open('https://www.instagram.com', '_blank');
      } else if (command.includes('project') || command.includes('work') || command.includes('portfolio')) {
        speak("Accessing project archives.");
        const el = document.getElementById('projects');
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('personal') || command.includes('file') || command.includes('profile') || command.includes('identity')) {
        speak("Authenticating... Access granted. Opening personnel file.");
        const el = document.getElementById('about');
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('education') || command.includes('academic') || command.includes('database') || command.includes('study')) {
        speak("Accessing academic database.");
        const el = document.querySelector('.edu-timeline') || document.getElementById('about');
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('skill') || command.includes('tech') || command.includes('matrix')) {
        speak("Accessing technical database.");
        const el = document.getElementById('skills');
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (command.includes('contact')) {
        speak("Opening secure communication channel.");
        const el = document.getElementById('contact');
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        speak("Access command acknowledged. Target unspecified.");
      }
    }
    else if (command.includes('scan') || command.includes('analyze') || command.includes('highlight')) {
      performSystemScan();
    }
    else if (command.includes('project') || command.includes('work') || command.includes('portfolio')) {
      speak("Accessing project archives. Displaying active developments.");
      const el = document.getElementById('projects');
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
    else if (command.includes('personnel') || command.includes('identity') || command.includes('about') || command.includes('profile')) {
      speak("Authenticating biometric signature... Access granted. Opening personnel file.");
      const el = document.getElementById('about');
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
    else if (command.includes('education') || command.includes('academic') || command.includes('dataset') || command.includes('study')) {
      speak("Retrieving academic dataset. Visualizing educational timeline.");
      const el = document.querySelector('.edu-timeline') || document.getElementById('about');
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
    else if (command.includes('skill') || command.includes('tech') || command.includes('matrix') || command.includes('capability')) {
      speak("Running diagnostic on technical capabilities. Displaying skill matrix.");
      const el = document.getElementById('skills');
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
    else if (command.includes('fill') && (command.includes('form') || command.includes('contact'))) {
      const contactSection = document.getElementById('contact');
      if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });

      formInteractionState = 'name';
      speak("Initiating form completion protocol. Please say 'Name' followed by your name.", () => {
        try { recognition.start(); } catch(e){}
      });
    }
    else if (command.includes('dictate') || (command.includes('write') && command.includes('message'))) {
      const messageField = document.getElementById('message');
      const contactSection = document.getElementById('contact');
      
      if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });

      let content = command.replace('dictate', '').replace('write', '').replace('message', '').trim();
      if(content.length > 0) content = content.charAt(0).toUpperCase() + content.slice(1);

      if (messageField) {
        messageField.value = content;
        messageField.focus();
        speak(content ? "Message transcribed." : "Ready for dictation.");
      }
    }
    else if (command.includes('contact') || command.includes('protocol') || command.includes('message') || command.includes('reach')) {
      speak("Initiating communication protocols. Secure channel established.");
      const el = document.getElementById('contact');
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
    else if (command.includes('download') && command.includes('resume')) {
      const resumeBtns = Array.from(document.querySelectorAll('.resume-btn'));
      let targetBtn = null;
      let type = "standard";

      if (command.includes('it') || command.includes('tech')) {
        targetBtn = resumeBtns.find(b => b.textContent.includes('IT'));
        type = "IT";
      } else if (command.includes('bpo') || command.includes('support')) {
        targetBtn = resumeBtns.find(b => b.textContent.includes('BPO'));
        type = "BPO";
      } else if (command.includes('edutech') || command.includes('education')) {
        targetBtn = resumeBtns.find(b => b.textContent.includes('EDUTECH'));
        type = "Edutech";
      } else if (command.includes('finance') || command.includes('account')) {
        targetBtn = resumeBtns.find(b => b.textContent.includes('FINANCE'));
        type = "Finance";
      } else {
        targetBtn = resumeBtns[0];
      }

      if (targetBtn) {
        speak(`Accessing secure archives. Downloading ${type} personnel record.`);
        targetBtn.click();
      } else {
        speak("Requested file not found.");
      }
    }
    else if (command.includes('combat') || command.includes('red') || command.includes('defense')) {
      document.body.classList.remove('stealth-mode');
      document.body.classList.add('combat-mode');
      playModeSound();
      speak("Combat mode engaged. Threat levels elevated.");
    }
    else if (command.includes('night') || command.includes('vision') || command.includes('green')) {
      document.body.classList.remove('stealth-mode');
      document.body.classList.remove('combat-mode');
      document.body.classList.add('night-vision');
      playModeSound();
      speak("Night vision enabled. Optical sensors calibrated.");
    }
    else if (command.includes('stealth') || command.includes('ghost') || command.includes('dark')) {
      document.body.classList.remove('combat-mode');
      document.body.classList.add('stealth-mode');
      playModeSound();
      speak("Stealth mode active. Visual signature minimized.");
    }
    else if (command.includes('flight') || command.includes('fly') || command.includes('autopilot')) {
      startFlightMode();
    }
    else if (command.includes('stop') || command.includes('abort') || command.includes('land') || command.includes('manual')) {
      stopFlightMode();
      speak("Flight mode disengaged. Manual control restored.");
    }
    else if (command.includes('override') || (command.includes('system') && command.includes('cancel'))) {
      const destructOverlay = document.getElementById('self-destruct-overlay');
      if (destructOverlay && destructOverlay.classList.contains('active')) {
        if (command.includes('alpha') || command.includes('stark')) {
          clearInterval(destructInterval);
          destructOverlay.classList.remove('active');
          speak("Passcode accepted. Self destruct sequence aborted.");
        } else {
          speak("Passcode required or incorrect.");
        }
      } else if (document.body.classList.contains('security-breach')) {
        document.body.classList.remove('security-breach');
        if (breachTimeout) clearTimeout(breachTimeout);
        speak("Override accepted. Security protocols disengaged.");
      } else {
        speak("No active security alerts to override.");
      }
    }
    else if (command.includes('reboot') || command.includes('restart') || command.includes('reload')) {
      performSystemReboot();
    }
    else if (command.includes('self') && (command.includes('destruct') || command.includes('destroy'))) {
      initiateSelfDestruct();
    }
    else if (command.includes('normal') || command.includes('standard') || command.includes('blue')) {
      document.body.classList.remove('stealth-mode');
      document.body.classList.remove('combat-mode');
      document.body.classList.remove('night-vision');
      playModeSound();
      speak("Systems normalized. Returning to standard configuration.");
    }
    else if (command.includes('status') || command.includes('system') || command.includes('diagnostic')) {
      speak("All systems nominal. Reactor core stable. Ready for instructions.");
    }
    else if (command.includes('hello') || command.includes('jarvis') || command.includes('tony') || command.includes('stark')) {
      speak("Greetings. V.E.C.T.O.R. system online. Awaiting instructions.");
    }
    else {
      speak("Command not recognized. Please restate protocol.");
    }
  };

  recognition.onerror = (event) => {
    console.error("Vector Speech Error:", event.error);
    updateStatus("ERROR: " + event.error);
    speak("System error.");
  };
})();

/* ==========================================================
   Startup Sound Effect (HUD Boot)
   ========================================================== */
window.addEventListener('load', () => {
  const startupAudio = document.getElementById('startup-sound');
  const equalizer = document.querySelector('.vector-equalizer');

  if (!startupAudio) return;

  startupAudio.volume = 0.4; // Moderate volume

  // Function to handle system boot visuals
  const initiateSystem = () => {
    if (equalizer) equalizer.classList.add('active');
  };

  // Attempt to play on load
  const playPromise = startupAudio.play();

  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log("System Audio: Autoplay prevented.");
    }).then(() => {
      // If autoplay succeeded (or when play is triggered)
      if (!startupAudio.paused) {
        initiateSystem();
      }
    });
  }

  // Stop equalizer when audio ends
  startupAudio.addEventListener('ended', () => {
    if (equalizer) equalizer.classList.remove('active');
  });
  
  // Also trigger initiateSystem on 'play' event just in case
  startupAudio.addEventListener('play', initiateSystem);
});

/* ==========================================================
   JARVIS Text Decoding Effect
   ========================================================== */
const jarvisElements = document.querySelectorAll('.section-title, .contact-title, .preview-meta h4, .edu-degree');

const jarvisObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      decodeText(entry.target);
      jarvisObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

jarvisElements.forEach(el => jarvisObserver.observe(el));

function decodeText(element) {
  const originalText = element.textContent;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  let iterations = 0;
  
  const interval = setInterval(() => {
    element.textContent = originalText.split("").map((letter, index) => {
      if (index < iterations) return originalText[index];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    
    if (iterations >= originalText.length) { 
      clearInterval(interval);
      element.textContent = originalText;
    }
    
    iterations += 1 / 2; 
  }, 30);
}

/* ==========================================================
   Demo lazy-load + loader for project iframes
   - Click `demo-launch` to load the iframe inline with animation
   - Subsequent click opens the live site in a new tab
   - Prefetch origin on hover for faster startup
   ========================================================== */
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.demo-launch');
  if (!btn) return;
  const src = btn.dataset && btn.dataset.src;
  if (!src) return;

  // Find the related preview-media container
  const media = btn.closest('.preview-media');
  const loader = media ? media.querySelector('.demo-loader') : btn.parentElement.querySelector('.demo-loader');
  const iframe = media ? media.querySelector('iframe') : null;

  // If already loaded, open in new tab
  if (btn.dataset.loaded === 'true') {
    window.open(src, '_blank', 'noopener');
    return;
  }

  // Show loader
  if (loader) { loader.hidden = false; loader.setAttribute('aria-hidden', 'false'); }
  btn.disabled = true;

  // Set iframe src to begin loading
  if (iframe) {
    iframe.src = src;
    const onLoaded = () => {
      if (loader) { loader.hidden = true; loader.setAttribute('aria-hidden', 'true'); }
      btn.dataset.loaded = 'true';
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-external-link-alt"></i> Open';
      iframe.removeEventListener('load', onLoaded);
    };
    iframe.addEventListener('load', onLoaded);
  } else {
    // fallback: open in new tab if no iframe present
    window.open(src, '_blank', 'noopener');
    if (loader) { loader.hidden = true; loader.setAttribute('aria-hidden', 'true'); }
    btn.disabled = false;
  }
});

// Prefetch origin on hover to speed up iframe connection
document.addEventListener('mouseover', (e) => {
  const btn = e.target.closest && e.target.closest('.demo-launch');
  if (!btn) return;
  const src = btn.dataset && btn.dataset.src;
  if (!src) return;
  try {
    const origin = new URL(src).origin;
    // Avoid duplicate preconnect links
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      document.head.appendChild(link);
    }
  } catch (err) { /* ignore malformed URLs */ }
});

/* ==========================================================
   Battery Level Indicator
   ========================================================== */
(function() {
  const batteryLevel = document.querySelector('.battery-level');
  const batteryText = document.querySelector('.battery-text');
  const chargingIcon = document.querySelector('.battery-charging-icon');
  const batteryHud = document.querySelector('.battery-hud');

  if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
      if(batteryHud) batteryHud.hidden = false;
      
      function updateBattery() {
        const level = Math.floor(battery.level * 100);
        if(batteryText) batteryText.textContent = level + '%';
        if(batteryLevel) batteryLevel.style.width = level + '%';
        
        if (battery.charging) {
          if(chargingIcon) chargingIcon.hidden = false;
          if(batteryText) batteryText.textContent += ' ⚡';
        } else {
          if(chargingIcon) chargingIcon.hidden = true;
        }

        // Color changes based on level
        if (level <= 20 && !battery.charging) {
          if(batteryHud) batteryHud.style.borderColor = '#ff3333';
          if(batteryLevel) batteryLevel.style.backgroundColor = '#ff3333';
        } else {
          if(batteryHud) batteryHud.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          if(batteryLevel) batteryLevel.style.backgroundColor = 'var(--accent-a)';
        }
      }

      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
      battery.addEventListener('chargingchange', updateBattery);
    });
  }
})();

/* ==========================================================
   Targeting System Cursor
   ========================================================== */
(function() {
  const cursor = document.getElementById('cursor-target');
  if (!cursor) return;

  // Only active on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, textarea, .preview-card, .edu-card, .skill-group, .vector-btn')) {
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover');
      }
    });
  } else {
    cursor.style.display = 'none';
  }
})();

/* ==========================================================
   Holographic Globe (Canvas)
   ========================================================== */
(function() {
  const canvas = document.getElementById('holo-globe');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let globeRadius;
  
  // Kakinada Coordinates (approx)
  const targetLat = 16.9891;
  const targetLon = 82.2475;

  function resize() {
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    globeRadius = width * 0.35;
  }
  
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  const particleCount = 500;

  // Initialize random points on sphere (Fibonacci Sphere algorithm for even distribution)
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
    particles.push({
      baseX: globeRadius * Math.cos(theta) * Math.sin(phi),
      baseY: globeRadius * Math.sin(theta) * Math.sin(phi),
      baseZ: globeRadius * Math.cos(phi)
    });
  }

  let rotation = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const cx = width / 2;
    const cy = height / 2;
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-a').trim() || '#6ef0d3';
    
    rotation += 0.003;

    // 1. Draw Globe Particles
    ctx.fillStyle = accentColor;
    
    particles.forEach(p => {
      // Rotate around Y axis
      const x = p.baseX * Math.cos(rotation) - p.baseZ * Math.sin(rotation);
      const z = p.baseX * Math.sin(rotation) + p.baseZ * Math.cos(rotation);
      const y = p.baseY;

      // Perspective Projection
      const scale = 300 / (300 - z); 
      const px = cx + x * scale;
      const py = cy + y * scale;
      const alpha = (z + globeRadius) / (2 * globeRadius); // Fade back points

      if (z < 100) { // Simple culling
        ctx.globalAlpha = Math.max(0.05, alpha * 0.6);
        ctx.beginPath();
        ctx.arc(px, py, 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 2. Draw Kakinada Marker
    // Convert Lat/Lon to 3D position on the rotating sphere
    // Math: Y is Up (North). 
    const radLat = targetLat * (Math.PI / 180);
    // Add rotation to longitude to simulate globe spinning
    const radLon = (targetLon * (Math.PI / 180)) + rotation + Math.PI; // +PI to align initial view

    const kY = -globeRadius * Math.sin(radLat); // Invert Y for canvas
    const rCosLat = globeRadius * Math.cos(radLat);
    const kX = rCosLat * Math.cos(radLon);
    const kZ = rCosLat * Math.sin(radLon);

    const kScale = 300 / (300 - kZ);
    const kPx = cx + kX * kScale;
    const kPy = cy + kY * kScale;

    // Only draw if on the front side
    if (kZ < 50) {
      ctx.globalAlpha = 1;
      
      // Pulsing Ring
      const time = Date.now() * 0.003;
      const pulse = 6 + Math.sin(time) * 3;
      
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(kPx, kPy, pulse * kScale, 0, Math.PI * 2);
      ctx.stroke();

      // Center Dot
      ctx.fillStyle = '#ff3333';
      ctx.beginPath();
      ctx.arc(kPx, kPy, 3 * kScale, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${12 * kScale}px "Courier New"`;
      ctx.fillText("KAKINADA", kPx + 12 * kScale, kPy + 4 * kScale);
      
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `${10 * kScale}px "Courier New"`;
      ctx.fillText("INDIA", kPx + 12 * kScale, kPy + 14 * kScale);
      
      // Connecting Line to center
      ctx.strokeStyle = 'rgba(255, 51, 51, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(kPx, kPy);
      ctx.lineTo(kPx + 10 * kScale, kPy + 10 * kScale);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }
  
  animate();
})();

/* ==========================================================
   Auto-load Project Demos on Scroll
   ========================================================== */
const demoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const btn = entry.target.querySelector('.demo-launch');
      if (btn && !btn.dataset.loaded && !btn.disabled) {
        btn.click();
      }
      demoObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px 100px 0px' });

document.querySelectorAll('.preview-media').forEach(media => {
  demoObserver.observe(media);
});
