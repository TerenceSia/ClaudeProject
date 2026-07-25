const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/terence.sia@gmail.com';

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

const form = document.getElementById('enquiry-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('.btn-submit');
const submitBtnLabel = submitBtn.querySelector('.btn-label');
const submitBtnDefaultText = submitBtnLabel.textContent;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      showStatus('success', "Thanks — we've received your request and will be in touch within one business day to schedule your free audit call.");
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
