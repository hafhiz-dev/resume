/**
 * Mohd Hafhiz Abdul Aziz - Freelance Developer Interactive Resume & Portfolio JavaScript
 * Features:
 *  - Dynamic Time-based Greeting & Live Clock
 *  - Dark / Light Mode Switcher with LocalStorage persistence
 *  - IntersectionObserver Animated Skill Progress Bars
 *  - Mobile Navigation Drawer
 *  - Quick Copy-to-Clipboard with Toast Feedback
 *  - Live "Edit & Personalize" Mode with LocalStorage Autosave
 *  - Contact Message Modal with Form Validation
 *  - Print / PDF Generator Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. DYNAMIC GREETING & CLOCK ---
  initDynamicGreeting();

  // --- 2. DARK / LIGHT THEME TOGGLE ---
  initThemeToggle();

  // --- 3. MOBILE NAVIGATION MENU ---
  initMobileMenu();

  // --- 4. ANIMATED SKILL BARS (INTERSECTION OBSERVER) ---
  initSkillBars();

  // --- 5. CLICK TO COPY CONTACT DETAILS ---
  initClickToCopy();

  // --- 6. CONTACT MODAL ---
  initContactModal();

  // --- 7. PRINT BUTTON ---
  initPrintButton();

  // --- 8. BACK TO TOP ---
  initBackToTop();

  // --- 9. CURRENT YEAR FOOTER ---
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- 10. BACKGROUND AMBIENT MUSIC PLAYER ---
  initBackgroundMusic();
});

/**
 * Dynamic Greeting based on visitor's local hour
 */
function initDynamicGreeting() {
  const greetingText = document.getElementById('greetingText');
  const greetingIcon = document.getElementById('greetingIcon');
  const greetingTime = document.getElementById('currentTimeBadge');
  const greetingBanner = document.getElementById('greetingBanner');
  const dismissBtn = document.getElementById('dismissGreeting');

  if (!greetingText || !greetingBanner) return;

  // Check if banner was dismissed in this session
  if (sessionStorage.getItem('dismissGreeting') === 'true') {
    greetingBanner.style.display = 'none';
  }

  function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let salutation = 'Good day';
    let icon = '👋';

    if (hours >= 5 && hours < 12) {
      salutation = 'Good morning';
      icon = '☀️';
    } else if (hours >= 12 && hours < 17) {
      salutation = 'Good afternoon';
      icon = '🌤️';
    } else if (hours >= 17 && hours < 22) {
      salutation = 'Good evening';
      icon = '🌇';
    } else {
      salutation = 'Good night';
      icon = '🌙';
    }

    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    greetingIcon.textContent = icon;
    greetingText.textContent = `${salutation}! Welcome to my interactive resume website.`;
    if (greetingTime) {
      greetingTime.textContent = `${timeString} Local Time`;
    }
  }

  updateGreeting();
  setInterval(updateGreeting, 60000);

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      greetingBanner.style.display = 'none';
      sessionStorage.setItem('dismissGreeting', 'true');
    });
  }
}

/**
 * Theme Toggle with LocalStorage and System Preference Check
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  const themeLabel = themeToggleBtn.querySelector('.theme-label');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('resume_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('resume_theme', newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} mode`);
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
      if (themeLabel) themeLabel.textContent = 'Light';
    } else {
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
      if (themeLabel) themeLabel.textContent = 'Dark';
    }
  }
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (!mobileBtn || !navMenu) return;

  mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close when clicking any nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

/**
 * Animated Skill Progress Bars on Scroll
 */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  if (!skillBars.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width') || '85%';
          bar.style.width = targetWidth;
          bar.style.setProperty('--print-width', targetWidth);
        });
        obs.disconnect(); // Trigger animation once
      }
    });
  }, observerOptions);

  const skillsSection = document.getElementById('skills-section');
  if (skillsSection) {
    observer.observe(skillsSection);
  } else {
    // Fallback if section observer is not supported
    skillBars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') || '85%';
    });
  }
}

/**
 * Click to Copy Contact Information to Clipboard
 */
function initClickToCopy() {
  const copyableItems = document.querySelectorAll('[data-copy]');
  copyableItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      const textToCopy = item.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard!`);
      }
    });
  });
}

/**
 * Send Message to Telegram (@MrIlmu)
 * Opens Telegram app directly on mobile, and Telegram Web/Desktop on desktop.
 */
function sendToTelegram(messageText) {
  const telegramUsername = 'MrIlmu';
  const defaultText = 'Hi Mohd Hafhiz, I came across your resume and would love to discuss...';
  const textToSend = messageText && messageText.trim().length > 0 ? messageText.trim() : defaultText;
  const encodedText = encodeURIComponent(textToSend);

  // Universal Telegram link with prefilled text:
  const telegramUrl = `https://t.me/${telegramUsername}?text=${encodedText}`;

  // Check if device is mobile
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  if (isMobile) {
    // On mobile, creating and clicking a direct link invokes the installed Telegram app
    const tempLink = document.createElement('a');
    tempLink.href = telegramUrl;
    tempLink.target = '_blank';
    tempLink.rel = 'noopener noreferrer';
    document.body.appendChild(tempLink);
    tempLink.click();
    setTimeout(() => {
      if (document.body.contains(tempLink)) {
        document.body.removeChild(tempLink);
      }
    }, 500);
  } else {
    // On desktop, open in a new tab
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Interactive Contact Modal (Telegram @MrIlmu)
 */
function initContactModal() {
  const openModalBtn = document.getElementById('openContactModal');
  const navContactBtn = document.getElementById('navContactBtn');
  const modal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeContactModal');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const contactForm = document.getElementById('contactForm');

  if (!modal) return;

  function openModal() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    const msgInput = document.getElementById('senderMessage');
    if (msgInput) {
      setTimeout(() => {
        msgInput.focus();
        msgInput.setSelectionRange(msgInput.value.length, msgInput.value.length);
      }, 150);
    }
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }
  if (navContactBtn) {
    navContactBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('senderName')?.value?.trim();
      const senderEmail = document.getElementById('senderEmail')?.value?.trim();
      const senderMsg = document.getElementById('senderMessage')?.value?.trim();

      const defaultMsg = 'Hi Mohd Hafhiz, I came across your resume and would love to discuss...';
      let messageToSend = senderMsg || defaultMsg;

      // If sender entered their name or email, append it cleanly to the message
      if (senderName || senderEmail) {
        messageToSend += `\n\n— From: ${senderName || 'Anonymous'}${senderEmail ? ` (${senderEmail})` : ''}`;
      }

      closeModal();
      showToast('Opening Telegram to message @MrIlmu...');
      sendToTelegram(messageToSend);
    });
  }
}


/**
 * Print & Save as PDF Trigger
 */
function initPrintButton() {
  const printBtn = document.getElementById('printBtn');
  if (!printBtn) return;

  printBtn.addEventListener('click', () => {
    // Force skill bars to show 100% or their target width for print
    document.querySelectorAll('.skill-bar').forEach(bar => {
      const w = bar.getAttribute('data-width') || '85%';
      bar.style.width = w;
    });

    window.print();
  });
}

/**
 * Back to Top Smooth Scrolling & Floating Mobile Visibility
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  // Toggle visible class for mobile floating action button when scrolled down
  function handleScroll() {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 120) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Utility: Sleek Toast Notifications
 */
function showToast(message, duration = 3200) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-accent)"></i> <span>${message}</span>`;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

/**
 * Background Ambient Music with Autoplay
 * Plays "Relax and Work Lofi" automatically with top-nav toggle control
 */
function initBackgroundMusic() {
  const audio = document.getElementById('bgMusicAudio');
  const navBtn = document.getElementById('musicToggleBtn');
  if (!audio) return;

  // Set comfortable default background volume
  const savedVolume = localStorage.getItem('resume_bg_music_vol');
  audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.4;

  function updatePlayState(isPlaying) {
    if (navBtn) {
      if (isPlaying) {
        navBtn.classList.add('is-playing');
        navBtn.setAttribute('title', 'Pause Background Music (Playing: Relax & Work)');
      } else {
        navBtn.classList.remove('is-playing');
        navBtn.setAttribute('title', 'Play Background Music (Relax & Work Lofi)');
      }
    }
  }

  let fallbackHandled = false;
  const interactionEvents = ['click', 'touchstart', 'scroll', 'keydown'];

  function onFirstInteraction() {
    if (fallbackHandled) return;
    fallbackHandled = true;
    removeAutoplayFallback();
    if (audio.paused) {
      audio.play().then(() => {
        updatePlayState(true);
        showToast('🎵 Playing: Relax & Work (Lofi)');
      }).catch(() => {});
    }
  }

  function setupAutoplayFallback() {
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onFirstInteraction, { once: true, passive: true });
    });
  }

  function removeAutoplayFallback() {
    interactionEvents.forEach((evt) => {
      window.removeEventListener(evt, onFirstInteraction);
    });
  }

  function startAudio() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayState(true);
          showToast('🎵 Playing: Relax & Work (Lofi)');
        })
        .catch(() => {
          // Autoplay policy prevented immediate playback without user gesture
          updatePlayState(false);
          setupAutoplayFallback();
        });
    }
  }

  function togglePlay() {
    removeAutoplayFallback();
    fallbackHandled = true;

    if (audio.paused) {
      audio.play().then(() => {
        updatePlayState(true);
        showToast('🎵 Playing: Relax & Work (Lofi)');
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    } else {
      audio.pause();
      updatePlayState(false);
      showToast('⏸️ Background music paused');
    }
  }

  // Top Nav Toggle Button
  if (navBtn) {
    navBtn.addEventListener('click', (e) => {
      e.preventDefault();
      togglePlay();
    });
  }

  // Sync with native audio events
  audio.addEventListener('play', () => updatePlayState(true));
  audio.addEventListener('pause', () => updatePlayState(false));
  audio.addEventListener('ended', () => updatePlayState(false));

  // Trigger autoplay on site load
  startAudio();
}

