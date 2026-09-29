// ==========================================================================
// Theme Toggle & Persistence (Claude Dark & Warm Paper Light)
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
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Warm Paper'} mode`);
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

window.addEventListener('scroll', highlightNavOnScroll);

// ==========================================================================
// Claude Prompt Box & Suggestion Chips
// ==========================================================================
const promptInput = document.getElementById('promptInput');
const promptSubmit = document.getElementById('promptSubmit');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

function handleNavigationTarget(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Add brief subtle glow highlight
    targetElement.style.outline = '2px solid var(--claude-terracotta)';
    targetElement.style.transition = 'outline 0.3s ease';
    setTimeout(() => {
      targetElement.style.outline = 'none';
    }, 2000);
  }
}

// Chip click listeners
suggestionChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const target = chip.getAttribute('data-target');
    handleNavigationTarget(target);
    showToast(`Navigated to ${chip.textContent.trim().replace('✦', '')}`);
  });
});

// Prompt input submission
function processPromptQuery() {
  if (!promptInput) return;
  const query = promptInput.value.toLowerCase().trim();
  if (!query) return;

  if (query.includes('astrotanttra')) {
    handleNavigationTarget('project-astrotanttra');
    showToast('Found: Astrotanttra Freelance Client Project');
  } else if (query.includes('freelance') || query.includes('service') || query.includes('consult')) {
    handleNavigationTarget('freelance');
    showToast('Found: Freelance Consulting & Services');
  } else if (query.includes('client') || query.includes('website')) {
    handleNavigationTarget('project-astrotanttra');
    showToast('Found: Astrotanttra Freelance Client Project');
  } else if (query.includes('cost') || query.includes('eks') || query.includes('optimizer') || query.includes('aws')) {
    handleNavigationTarget('project-cost-optimizer');
    showToast('Found: EKS Cost Optimizer');
  } else if (query.includes('nutriflow') || query.includes('ci/cd') || query.includes('gitops')) {
    handleNavigationTarget('project-nutriflow');
    showToast('Found: NutriFlow AI CI/CD Engine');
  } else if (query.includes('exp') || query.includes('work') || query.includes('job') || query.includes('role')) {
    handleNavigationTarget('experience');
    showToast('Found: Professional Experience');
  } else if (query.includes('skill') || query.includes('k8s') || query.includes('kubernetes') || query.includes('terraform')) {
    handleNavigationTarget('skills');
    showToast('Found: Technical Skills');
  } else if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('message')) {
    handleNavigationTarget('contact');
    showToast('Found: Contact & Message Channels');
  } else if (query.includes('edu') || query.includes('degree') || query.includes('mca')) {
    handleNavigationTarget('education');
    showToast('Found: Education & Degrees');
  } else {
    handleNavigationTarget('projects');
    showToast(`Showing relevant work for: "${query}"`);
  }
}

if (promptSubmit) {
  promptSubmit.addEventListener('click', processPromptQuery);
}

if (promptInput) {
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      processPromptQuery();
    }
  });
}

// ==========================================================================
// Artifacts Category Filtering
// ==========================================================================
const tabButtons = document.querySelectorAll('.tab-btn, .tab-tab-btn');
const artifactCards = document.querySelectorAll('.artifact-card');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-tab');

    artifactCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
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
// Toast Notification (Claude Style)
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
// Contact Form Submission (mailto trigger)
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

    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'New Message'}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailtoUrl = `mailto:anshm8888@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    showToast('Opening email client...');
    window.location.href = mailtoUrl;

    contactForm.reset();
  });
}

// Initialize on page load
initTheme();
