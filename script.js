// ==========================================================================
// Theme Toggle & Persistence
// ==========================================================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.setAttribute('data-theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
  });
}

// ==========================================================================
// Mobile Navigation Menu
// ==========================================================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

// ==========================================================================
// Active Navigation Spy on Scroll
// ==========================================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 110;
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

window.addEventListener('scroll', highlightNavOnScroll);

// ==========================================================================
// Project Category Filtering
// ==========================================================================
const filterChips = document.querySelectorAll('.filter-chip');
const projectCards = document.querySelectorAll('.project-card');
const caseStudySection = document.getElementById('case-study');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.getAttribute('data-filter');

    if (filter === 'freelance') {
      // Smoothly scroll to the case study
      if (caseStudySection) {
        caseStudySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Viewing Featured Freelance Case Study');
      }
      projectCards.forEach(card => card.style.display = 'flex');
    } else {
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });
});

// ==========================================================================
// Copy to Clipboard Utility
// ==========================================================================
const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const textToCopy = button.getAttribute('data-copy');
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`Copied to clipboard: ${textToCopy}`);
    }).catch(() => {
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(`Copied: ${textToCopy}`);
    });
  });
});

// ==========================================================================
// Toast Notification
// ==========================================================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ==========================================================================
// Inquiry Form Submission
// ==========================================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const mailtoSubject = encodeURIComponent(`[Project Inquiry] ${subject || 'New Project'}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nProject Scope & Message:\n${message}`
    );

    const mailtoUrl = `mailto:anshm8888@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    showToast('Opening your email client to send message...');
    window.location.href = mailtoUrl;

    contactForm.reset();
  });
}

// Initialize on page load
initTheme();
