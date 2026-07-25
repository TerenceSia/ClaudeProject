const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/terence.sia@gmail.com';
const WHATSAPP_NUMBER = '6591683502';

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const whatsappToggle = document.getElementById('whatsapp-toggle');
const whatsappPanel = document.getElementById('whatsapp-panel');
const whatsappClose = document.getElementById('whatsapp-panel-close');

function openWhatsappPanel() {
  whatsappPanel.hidden = false;
  whatsappToggle.setAttribute('aria-expanded', 'true');
}

function closeWhatsappPanel() {
  whatsappPanel.hidden = true;
  whatsappToggle.setAttribute('aria-expanded', 'false');
}

whatsappToggle.addEventListener('click', () => {
  if (whatsappPanel.hidden) {
    openWhatsappPanel();
  } else {
    closeWhatsappPanel();
  }
});

whatsappClose.addEventListener('click', closeWhatsappPanel);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !whatsappPanel.hidden) closeWhatsappPanel();
});

document.addEventListener('click', (e) => {
  if (whatsappPanel.hidden) return;
  if (e.target.closest('.whatsapp-widget')) return;
  closeWhatsappPanel();
});

document.querySelectorAll('.whatsapp-quick-reply').forEach((button) => {
  button.addEventListener('click', () => {
    const message = button.dataset.message || '';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
    closeWhatsappPanel();
  });
});

const form = document.getElementById('enquiry-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('.btn-submit');
const submitBtnLabel = submitBtn.querySelector('.btn-label');
const submitBtnDefaultText = submitBtnLabel.textContent;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function speakConfirmation(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function setFieldError(fieldName, message) {
  const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
  const row = form.querySelector(`#${fieldName}`).closest('.form-row');
  if (errorEl) errorEl.textContent = message || '';
  row.classList.toggle('invalid', Boolean(message));
}

function validate() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let isValid = true;

  if (!name) {
    setFieldError('name', 'Please enter your name.');
    isValid = false;
  } else {
    setFieldError('name', '');
  }

  if (!email) {
    setFieldError('email', 'Please enter your email.');
    isValid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    setFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  } else {
    setFieldError('email', '');
  }

  if (!message) {
    setFieldError('message', 'Please enter a message.');
    isValid = false;
  } else {
    setFieldError('message', '');
  }

  return isValid;
}

function showStatus(type, message) {
  statusEl.textContent = message;
  statusEl.className = 'form-status ' + type;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showStatus('', '');

  if (!validate()) return;

  submitBtn.disabled = true;
  submitBtnLabel.textContent = 'Sending…';

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    company: form.company.value.trim(),
    message: form.message.value.trim(),
    _subject: 'New growth audit request from Meridian website',
    _captcha: 'false',
  };

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showStatus('success', "Thanks — we've received your request and will be in touch within 3 business days to schedule your free audit call.");
      speakConfirmation('Thank you for your submission. We will get back in 3 business days.');
      form.reset();
    } else {
      showStatus('error', 'Something went wrong sending your request. Please try again or email us directly.');
    }
  } catch (err) {
    showStatus('error', 'Something went wrong sending your request. Please check your connection and try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtnLabel.textContent = submitBtnDefaultText;
  }
});
