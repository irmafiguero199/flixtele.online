/**
 * FLIXTELE - IPTV Canada Website
 * Main JavaScript File
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initAnnouncementBar();
  initScrollReveal();
  initFAQ();
  initCounters();
  initMobileMenu();
  initSmoothScroll();
  initCheckoutRedirect();
});

// Navbar Scroll Effect
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Announcement Bar Dismiss
function initAnnouncementBar() {
  const bar = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.announcement-close');
  
  if (!bar || !closeBtn) return;
  
  // Check if previously dismissed
  if (localStorage.getItem('announcementDismissed') === 'true') {
    bar.style.display = 'none';
    document.body.style.paddingTop = '70px';
  } else {
    document.body.style.paddingTop = '110px';
  }
  
  closeBtn.addEventListener('click', function() {
    bar.style.display = 'none';
    document.body.style.paddingTop = '70px';
    localStorage.setItem('announcementDismissed', 'true');
  });
}

// Scroll Reveal Animation
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger || !navLinks) return;
  
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Checkout Redirect
function initCheckoutRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  
  if (plan && window.location.pathname.includes('checkout.html')) {
    const planDetails = getPlanDetails(plan);
    if (planDetails) {
      updateCheckoutPage(planDetails);
    }
  }
}

function getPlanDetails(plan) {
  const plans = {
    monthly: {
      name: 'Monthly Plan',
      price: '$12.99',
      period: '/month',
      devices: '1 device',
      message: 'Hi! I want the Monthly IPTV plan ($12.99 CAD). How do I pay?'
    },
    '3month': {
      name: '3-Month Plan',
      price: '$39.99',
      period: '',
      devices: '2 devices',
      message: 'Hi! I want the 3-Month IPTV plan ($39.99 CAD). How do I pay?'
    },
    '6month': {
      name: '6-Month Plan',
      price: '$44.99',
      period: '',
      devices: '3 devices',
      message: 'Hi! I want the 6-Month IPTV plan ($44.99 CAD). How do I pay?'
    },
    yearly: {
      name: 'Yearly Plan',
      price: '$69.99',
      period: '/year',
      devices: '4 devices',
      message: 'Hi! I want the Yearly IPTV plan ($69.99 CAD). How do I pay?'
    }
  };
  
  return plans[plan];
}

function updateCheckoutPage(planDetails) {
  const planName = document.querySelector('.checkout-plan h3');
  const planPrice = document.querySelector('.checkout-price');
  const whatsappBtn = document.querySelector('.checkout-whatsapp');
  
  if (planName) planName.textContent = planDetails.name;
  if (planPrice) {
    planPrice.innerHTML = `${planDetails.price}<span>${planDetails.period}</span>`;
  }
  if (whatsappBtn) {
    const whatsappNumber = '212776056268';
    whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(planDetails.message)}`;
  }
}

// Utility: Format Currency
function formatCurrency(amount, currency = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Throttle
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Channel Filter (for channels page)
function filterChannels(category) {
  const channels = document.querySelectorAll('.channel-item');
  const chips = document.querySelectorAll('.channel-chip');
  
  chips.forEach(chip => {
    chip.classList.remove('active');
    if (chip.dataset.category === category) {
      chip.classList.add('active');
    }
  });
  
  channels.forEach(channel => {
    if (category === 'all' || channel.dataset.category === category) {
      channel.style.display = 'flex';
    } else {
      channel.style.display = 'none';
    }
  });
}

// Lazy Loading Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Performance: Preload critical resources
function preloadResources() {
  const resources = [
    '/assets/css/style.css',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
  ];
  
  resources.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = href.endsWith('.css') ? 'style' : 'font';
    if (link.as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

// Analytics: Track WhatsApp clicks
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  link.addEventListener('click', function() {
    // Google Analytics event (if GA is installed)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: this.getAttribute('href')
      });
    }
  });
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
