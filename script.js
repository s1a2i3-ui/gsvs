// JavaScript logic for Professional Student Portfolio

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTypingEffect();
  initHorizontalScroll();
  initGalleryFilter();
  initCertificateModal();
  initGalleryLightbox();
  initContactForm();
  initScrollAnimations();
});

/* =========================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================= */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // Check stored theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'bi bi-sun-fill';
    } else {
      themeIcon.className = 'bi bi-moon-stars-fill';
    }
  }
}

/* =========================================================
   2. Typing Effect for Hero Title
   ========================================================= */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const phrases = [
    'Computer Science & AI Student 🚀',
    'Full-Stack Developer 💻',
    'Hackathon Winner 🏆',
    'AWS & Cloud Enthusiast ☁️',
    'Robotics & ML Researcher 🤖'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2200; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* =========================================================
   3. Horizontal Scrolling Certificates Logic
   ========================================================= */
function initHorizontalScroll() {
  const container = document.getElementById('certScrollContainer');
  const btnLeft = document.getElementById('certScrollLeft');
  const btnRight = document.getElementById('certScrollRight');
  const progressFill = document.getElementById('certProgressFill');

  if (!container) return;

  const scrollAmount = 360;

  if (btnLeft) {
    btnLeft.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (btnRight) {
    btnRight.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Update scroll progress fill
  function updateProgress() {
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      if (progressFill) progressFill.style.width = '100%';
      return;
    }
    const currentScroll = container.scrollLeft;
    const percentage = Math.min(100, Math.max(10, (currentScroll / maxScroll) * 100));
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  }

  container.addEventListener('scroll', updateProgress);
  updateProgress();

  // Mouse Drag to Scroll functionality
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => { isDown = false; });
  container.addEventListener('mouseup', () => { isDown = false; });
  
  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    container.scrollLeft = scrollLeft - walk;
  });
}

/* =========================================================
   4. Certificate Details Modal
   ========================================================= */
function initCertificateModal() {
  const certModal = document.getElementById('certDetailModal');
  if (!certModal) return;

  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const org = card.getAttribute('data-org');
      const date = card.getAttribute('data-date');
      const certId = card.getAttribute('data-id');
      const skills = card.getAttribute('data-skills');
      const imgSrc = card.querySelector('.cert-img')?.src || '';

      document.getElementById('modalCertTitle').textContent = title;
      document.getElementById('modalCertOrg').textContent = org;
      document.getElementById('modalCertDate').textContent = date;
      document.getElementById('modalCertId').textContent = certId;
      document.getElementById('modalCertSkills').textContent = skills;
      document.getElementById('modalCertImg').src = imgSrc;

      const bsModal = new bootstrap.Modal(certModal);
      bsModal.show();
    });
  });
}

/* =========================================================
   5. Gallery Filtering
   ========================================================= */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.btn-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* =========================================================
   6. Gallery Lightbox Modal
   ========================================================= */
function initGalleryLightbox() {
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  if (!lightboxModal) return;

  let currentGalleryIndex = 0;
  const itemsData = [];

  galleryCards.forEach((card, idx) => {
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-cat-label');
    const desc = card.getAttribute('data-desc');
    const date = card.getAttribute('data-date');
    const imgSrc = card.querySelector('.gallery-img')?.src || '';

    itemsData.push({ title, category, desc, date, imgSrc });

    card.addEventListener('click', () => {
      currentGalleryIndex = idx;
      updateLightboxContent(currentGalleryIndex);
      const bsModal = new bootstrap.Modal(lightboxModal);
      bsModal.show();
    });
  });

  function updateLightboxContent(index) {
    const item = itemsData[index];
    if (!item) return;

    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxCategory').textContent = item.category;
    document.getElementById('lightboxDesc').textContent = item.desc;
    document.getElementById('lightboxDate').textContent = item.date;
    document.getElementById('lightboxImg').src = item.imgSrc;
  }

  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + itemsData.length) % itemsData.length;
      updateLightboxContent(currentGalleryIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % itemsData.length;
      updateLightboxContent(currentGalleryIndex);
    });
  }
}

/* =========================================================
   7. Contact Form Handling
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successModal = document.getElementById('contactSuccessModal');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Show success modal feedback
      if (successModal) {
        document.getElementById('successClientName').textContent = name;
        const modal = new bootstrap.Modal(successModal);
        modal.show();
      } else {
        alert(`Thank you, ${name}! Your message has been sent successfully.`);
      }

      form.reset();
    });
  }
}

/* =========================================================
   8. Scroll Effects & Active Link Tracking
   ========================================================= */
function initScrollAnimations() {
  const navbar = document.querySelector('.navbar-custom');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('shadow-lg');
    } else {
      navbar?.classList.remove('shadow-lg');
    }
  });
}
