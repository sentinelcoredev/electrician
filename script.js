// script.js

/**
 * ==========================================================================
 * SPARKVOLT INTERACTIVE ENGINE
 * Technical Overview of Embedded Animations & Logical Routing
 * ==========================================================================
 * 
 * 1. INTERSECTION OBSERVER (Scroll Animations):
 *    - Uses browser API to observe elements as they enter the viewport.
 *    - Adds '.visible' CSS class to trigger CSS transition matrix (GPU-accelerated).
 * 
 * 2. LIVE MATERIAL ESTIMATOR LOGIC:
 *    - Calculates custom wire (1m = $3.50) & conduit costs dynamically.
 *    - Transfers output directly to the contact text area on button click.
 * 
 * 3. DYNAMIC FORM ROUTING:
 *    - Cards pre-select dropdown items and smoothly scroll down to #contact.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------
   * 1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   * ---------------------------------------------------------------------- */
  const observerOptions = {
    root: null,
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve once animated to optimize memory footprint
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target all elements needing entry animations
  const animatableElements = document.querySelectorAll('.hero-content, .card, .section-title');
  animatableElements.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------------------
   * 2. MATERIAL PRICING ESTIMATOR (Wire + Conduit Calculator)
   * ---------------------------------------------------------------------- */
  const WIRE_PRICE_PER_METER = 6.50;
  const CONDUIT_PRICE_PER_METER = 4.00;

  const wireInput = document.getElementById('wire-length');
  const conduitInput = document.getElementById('conduit-length');
  const totalDisplay = document.getElementById('total-material-cost');
  const attachBtn = document.getElementById('add-to-request-btn');
  const notesTextarea = document.getElementById('notes');

  function calculateMaterials() {
    const wireMeters = parseFloat(wireInput.value) || 0;
    const conduitMeters = parseFloat(conduitInput.value) || 0;

    const totalCost = (wireMeters * WIRE_PRICE_PER_METER) + (conduitMeters * CONDUIT_PRICE_PER_METER);
    totalDisplay.textContent = `₹${totalCost.toFixed(2)}`;

    return { wireMeters, conduitMeters, totalCost };
  }

  // Live input listening
  wireInput.addEventListener('input', calculateMaterials);
  conduitInput.addEventListener('input', calculateMaterials);

  // Attach materials summary directly to contact form notes
  attachBtn.addEventListener('click', () => {
    const { wireMeters, conduitMeters, totalCost } = calculateMaterials();
    const summaryText = `[Material Estimate Attached: ${wireMeters}m Wire (₹${(wireMeters * WIRE_PRICE_PER_METER).toFixed(2)}) + ${conduitMeters}m Conduit (₹${(conduitMeters * CONDUIT_PRICE_PER_METER).toFixed(2)}) = Total Extra: ₹${totalCost.toFixed(2)}]`;

    if (!notesTextarea.value.includes(summaryText)) {
      notesTextarea.value = notesTextarea.value ? `${notesTextarea.value}\n${summaryText}` : summaryText;
    }
  });


  /* ----------------------------------------------------------------------
   * 3. SMART CARD-TO-CONTACT ROUTING
   * ---------------------------------------------------------------------- */
  const serviceSelect = document.getElementById('service-select');
  const cardButtons = document.querySelectorAll('.price-card .btn-card');

  cardButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.price-card');
      const serviceTitle = card.querySelector('h3').textContent;

      // Match selected service to dropdown options
      for (let option of serviceSelect.options) {
        if (option.text.includes(serviceTitle) || serviceTitle.includes(option.value)) {
          serviceSelect.value = option.value;
          break;
        }
      }
    });
  });


  /* ----------------------------------------------------------------------
   * 4. CONTACT FORM SUBMISSION INTERACTION
   * ---------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual feedback simulation
    formFeedback.className = 'form-feedback success';
    formFeedback.textContent = '⚡ Request received! A certified technician will call you within 15 minutes.';
    
    contactForm.reset();
    calculateMaterials(); // Reset price display to initial values

    setTimeout(() => {
      formFeedback.style.display = 'none';
    }, 6000);
  });
});
