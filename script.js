/**
 * PTR GRAND — FINE DINING RESTAURANT
 * Interactive Features Script
 * -----------------------------------------------------------------------------
 * 1. Mobile Navigation & Header Scroll State
 * 2. Active Page Link Detection
 * 3. Menu Category Filtering (DOM Animation)
 * 4. Lightbox Modal Gallery Viewer
 * 5. Reservation Form Validation & Dynamic Confirmation Modal
 * 6. Contact Form Validation & Success Feedback
 * 7. Scroll Reveal Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  setActiveNavLink();
  initMenuFilters();
  initGalleryLightbox();
  initReservationForm();
  initContactForm();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Header Scroll State & Shrink Behavior
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-menu');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close mobile nav when clicking links
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Active Page Navigation Link Detection
   -------------------------------------------------------------------------- */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Menu Category Filtering
   -------------------------------------------------------------------------- */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dishCards = document.querySelectorAll('.dish-card[data-category]');

  if (!filterBtns.length || !dishCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      dishCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Lightbox Modal Gallery Viewer
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  if (!modal || !galleryItems.length) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || img.alt;

      if (img && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = caption;
        if (modalCaption) modalCaption.textContent = caption;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Reservation Form Validation & Dynamic Success State
   -------------------------------------------------------------------------- */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  const successModal = document.getElementById('reservation-success-modal');
  if (!form) return;

  // Set min date to today
  const dateInput = form.querySelector('#res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Form fields
    const name = form.querySelector('#res-name');
    const email = form.querySelector('#res-email');
    const phone = form.querySelector('#res-phone');
    const date = form.querySelector('#res-date');
    const time = form.querySelector('#res-time');
    const guests = form.querySelector('#res-guests');

    // Validation checks
    if (!name || name.value.trim() === '') {
      setError(name, 'Please provide your full name');
      isValid = false;
    } else {
      clearError(name);
    }

    if (!email || !validateEmail(email.value)) {
      setError(email, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(email);
    }

    if (!phone || phone.value.trim().length < 7) {
      setError(phone, 'Please enter a valid phone number');
      isValid = false;
    } else {
      clearError(phone);
    }

    if (!date || date.value === '') {
      setError(date, 'Please select a reservation date');
      isValid = false;
    } else {
      clearError(date);
    }

    if (!time || time.value === '') {
      setError(time, 'Please select a preferred time slot');
      isValid = false;
    } else {
      clearError(time);
    }

    if (!guests || guests.value === '') {
      setError(guests, 'Please select number of guests');
      isValid = false;
    } else {
      clearError(guests);
    }

    if (isValid) {
      const refCode = 'PTR-' + Math.floor(100000 + Math.random() * 900000);
      
      const resDetails = document.getElementById('res-confirm-details');
      if (resDetails) {
        resDetails.innerHTML = `
          <p style="margin-bottom:0.5rem;"><strong>Reservation Ref:</strong> <span style="color:var(--accent-gold);">${refCode}</span></p>
          <p style="margin-bottom:0.5rem;"><strong>Guest Name:</strong> ${escapeHtml(name.value)}</p>
          <p style="margin-bottom:0.5rem;"><strong>Date & Time:</strong> ${escapeHtml(date.value)} at ${escapeHtml(time.value)}</p>
          <p style="margin-bottom:0.5rem;"><strong>Party Size:</strong> ${escapeHtml(guests.value)} Guest(s)</p>
          <p style="font-size:0.85rem; color:var(--text-muted-light); margin-top:1rem;">A confirmation email has been sent to ${escapeHtml(email.value)}.</p>
        `;
      }

      if (successModal) {
        successModal.classList.add('active');
      }

      form.reset();
    }
  });

  const closeSuccessBtn = document.getElementById('close-reservation-modal');
  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   7. Contact Form Validation & Feedback Modal
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successModal = document.getElementById('contact-success-modal');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const name = form.querySelector('#contact-name');
    const email = form.querySelector('#contact-email');
    const message = form.querySelector('#contact-message');

    if (!name || name.value.trim() === '') {
      setError(name, 'Please enter your name');
      isValid = false;
    } else {
      clearError(name);
    }

    if (!email || !validateEmail(email.value)) {
      setError(email, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(email);
    }

    if (!message || message.value.trim().length < 10) {
      setError(message, 'Message must be at least 10 characters long');
      isValid = false;
    } else {
      clearError(message);
    }

    if (isValid) {
      if (successModal) {
        successModal.classList.add('active');
      }
      form.reset();
    }
  });

  const closeContactBtn = document.getElementById('close-contact-modal');
  if (closeContactBtn && successModal) {
    closeContactBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   8. Helper Functions & Scroll Reveal
   -------------------------------------------------------------------------- */
function setError(inputElement, message) {
  const group = inputElement.closest('.form-group');
  if (!group) return;

  group.classList.add('error');
  let errorDisplay = group.querySelector('.error-text');
  if (errorDisplay) {
    errorDisplay.textContent = message;
  }
}

function clearError(inputElement) {
  const group = inputElement.closest('.form-group');
  if (!group) return;
  group.classList.remove('error');
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
