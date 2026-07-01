/* ============================================
   MODERN PORTFOLIO - INTERACTIVE JAVASCRIPT
   Srikar Kuchi - AI Product Builder
   ============================================ */

// ========== DOM ELEMENTS ==========
const cursorFollower = document.querySelector('.cursor-follower');
const cursorDot = document.querySelector('.cursor-dot');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');

// ========== CUSTOM CURSOR ==========
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Smooth follower animation
function animateCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-category, .tool-item');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('hover');
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
    
    lastScroll = currentScroll;
});

// ========== MOBILE MENU TOGGLE ==========
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== ACTIVE NAV LINK UPDATE ==========
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========== SKILL BAR ANIMATION ==========
function animateSkillBars() {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const barTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (barTop < windowHeight - 100) {
            bar.style.width = progress + '%';
        }
    });
}

// Initial check and scroll listener
window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// ========== SCROLL REVEAL ANIMATION ==========
const revealElements = document.querySelectorAll('.skill-category, .experience-card, .project-card, .education-card, .stat-card');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ========== PARALLAX EFFECT FOR GRADIENT ORBS ==========
const orbs = document.querySelectorAll('.gradient-orb');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== TYPING EFFECT FOR HERO TITLE ==========
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const titleLines = heroTitle.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.style.animationDelay = `${0.2 + index * 0.2}s`;
    });
}

// ========== 3D CARD TILT EFFECT ==========
const cards = document.querySelectorAll('.project-card, .experience-card, .stat-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ========== CODE WINDOW ANIMATION ==========
const codeWindow = document.querySelector('.code-window');
if (codeWindow) {
    // Add typing effect to code
    const codeContent = codeWindow.querySelector('.window-content code');
    if (codeContent) {
        const originalHTML = codeContent.innerHTML;
        codeContent.innerHTML = '';
        
        setTimeout(() => {
            codeContent.innerHTML = originalHTML;
        }, 1000);
    }
}

// ========== MAGNETIC BUTTON EFFECT ==========
const magneticButtons = document.querySelectorAll('.btn, .social-link, .social-btn');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ========== SCROLL PROGRESS INDICATOR ==========
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createScrollProgress();

// ========== LAZY LOADING IMAGES ==========
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ========== PERFORMANCE OPTIMIZATION ==========
// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
    animateSkillBars();
    revealOnScroll();
}, 100));

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== INITIALIZATION ==========
window.addEventListener('load', () => {
    // Trigger initial animations
    setTimeout(() => {
        animateSkillBars();
        revealOnScroll();
    }, 300);
});

// ========== ACCESSIBILITY ENHANCEMENTS ==========
// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #6366f1;
    color: white;
    padding: 8px 16px;
    z-index: 10000;
    transition: top 0.3s;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D viewer if present
    init3DViewer();
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
});

// ========== 3D VIEWER FOR MAVERICK OS ==========
function init3DViewer() {
    const viewer = document.getElementById('maverick-3d-viewer');
    if (!viewer) return;
    
    const carousel = document.getElementById('viewer-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const frameCounter = document.getElementById('frame-counter');
    
    if (!carousel || !prevBtn || !nextBtn || !frameCounter) return;
    
    // Load all images from assets folder
    const totalFrames = 200; // maverick_ os full_processed_000 to 199
    const images = [];
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    
    // Create image elements
    for (let i = 0; i < totalFrames; i++) {
        const img = document.createElement('img');
        const frameNumber = String(i).padStart(3, '0');
        img.src = `assets/maverick_ os full_processed_${frameNumber}.jpg`;
        img.alt = `Maverick OS Frame ${i + 1}`;
        img.loading = 'lazy';
        img.className = i === 0 ? 'active' : '';
        carousel.appendChild(img);
        images.push(img);
    }
    
    // Update frame counter
    function updateFrameCounter() {
        frameCounter.textContent = `${currentIndex + 1} / ${totalFrames}`;
    }
    
    // Show specific frame
    function showFrame(index) {
        images.forEach(img => img.classList.remove('active'));
        currentIndex = (index + totalFrames) % totalFrames;
        images[currentIndex].classList.add('active');
        updateFrameCounter();
    }
    
    // Next frame
    function nextFrame() {
        showFrame(currentIndex + 1);
    }
    
    // Previous frame
    function prevFrame() {
        showFrame(currentIndex - 1);
    }
    
    // Button event listeners
    prevBtn.addEventListener('click', prevFrame);
    nextBtn.addEventListener('click', nextFrame);
    
    // Mouse drag functionality
    viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        viewer.style.cursor = 'grabbing';
    });
    
    viewer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextFrame();
            } else {
                prevFrame();
            }
            startX = e.clientX;
        }
    });
    
    viewer.addEventListener('mouseup', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });
    
    viewer.addEventListener('mouseleave', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });
    
    // Touch support for mobile
    viewer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });
    
    viewer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.touches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextFrame();
            } else {
                prevFrame();
            }
            startX = e.touches[0].clientX;
        }
    });
    
    viewer.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Scroll wheel functionality
    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            nextFrame();
        } else {
            prevFrame();
        }
    }, { passive: true });
    
    // Keyboard navigation
    viewer.setAttribute('tabindex', '0');
    viewer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevFrame();
        } else if (e.key === 'ArrowRight') {
            nextFrame();
        }
    });
    
    // Initialize
    updateFrameCounter();
    
    // Preload first few images
    for (let i = 0; i < 5; i++) {
        if (images[i]) {
            images[i].load();
        }
    }
}