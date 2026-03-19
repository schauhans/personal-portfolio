// ---- Henna Carousel ----
(function () {
  const carousel = document.getElementById('henna-carousel');
  if (!carousel) return;

  const items = [...carousel.querySelectorAll('.carousel-item')];
  const window_ = carousel.querySelector('.carousel-window');
  const n = items.length;
  let active = 0;

  function getOffset(i) {
    let pos = ((i - active) % n + n) % n;
    if (pos > n / 2) pos -= n;
    return pos;
  }

  function update() {
    const W = window_.offsetWidth;
    items.forEach((item, i) => {
      const off = getOffset(i);
      const abs = Math.abs(off);
      let scale, opacity, tx, zIndex;

      if (abs === 0) {
        scale = 1;    opacity = 1;    tx = 0;            zIndex = 5;
      } else if (abs === 1) {
        scale = 0.7;  opacity = 0.6;  tx = off * W * 0.44; zIndex = 4;
      } else if (abs === 2) {
        scale = 0.5;  opacity = 0.3;  tx = off * W * 0.72; zIndex = 3;
      } else {
        scale = 0.35; opacity = 0;    tx = off * W * 0.9;  zIndex = 1;
      }

      item.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = zIndex;
    });
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => {
    active = (active - 1 + n) % n;
    update();
  });

  carousel.querySelector('.carousel-next').addEventListener('click', () => {
    active = (active + 1) % n;
    update();
  });

  // Click a non-active item to bring it to center
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i !== active) { active = i; update(); }
    });
  });

  // Keyboard navigation when hovering carousel
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { active = (active - 1 + n) % n; update(); }
    if (e.key === 'ArrowRight') { active = (active + 1) % n; update(); }
  });

  update();
  window.addEventListener('resize', update);
})();

// ---- Contact Form ----
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  status.textContent = '';
  status.className = '';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      status.textContent = 'Message sent! I\'ll get back to you soon.';
      status.className = 'success';
      form.reset();
    } else {
      status.textContent = data.error || 'Something went wrong.';
      status.className = 'error';
    }
  } catch {
    status.textContent = 'Network error. Please try again.';
    status.className = 'error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});
