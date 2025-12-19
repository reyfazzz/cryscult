document.addEventListener('DOMContentLoaded', function () {

  // If user is already logged in (has token), redirect to home
  if (localStorage.getItem('token')) {
    window.location.href = '../index.html';
  }

  const API_URL = 'http://localhost:3000'; // Change when deploying

  // =============== PASSWORD STRENGTH FUNCTION (shared) ===============
  function setupPasswordStrength(passwordInputId, strengthIndicatorSelector) {
    const passwordInput = document.getElementById(passwordInputId);
    const strengthIndicator = document.querySelector(strengthIndicatorSelector);

    if (!passwordInput || !strengthIndicator) return;

    passwordInput.addEventListener('input', function () {
      const password = this.value;
      let strength = 0;

      if (password.length > 5) strength += 1;
      if (password.length > 8) strength += 1;
      if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
      if (password.match(/([0-9])/)) strength += 1;
      if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

      strengthIndicator.className = 'password-strength'; // reset classes
      if (password.length > 0) {
        if (strength < 2) {
          strengthIndicator.classList.add('weak');
        } else if (strength < 4) {
          strengthIndicator.classList.add('medium');
        } else if (strength >= 4) {
          strengthIndicator.classList.add('strong');
        }
      }
    });
  }

  // =============== REGISTER ===============
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    // Setup password strength for register
    setupPasswordStrength('password', '.password-strength');

    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      clearErrors();
      let isValid = true;

      if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters');
        isValid = false;
      }
      if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
      }
      if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
      }
      if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
      }

      if (isValid) {
        try {
          const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
          });

          const data = await response.json();

          if (response.ok) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Registration successful! Redirecting...';
            registerForm.prepend(successMessage);

            // Auto-login after register
            const loginRes = await fetch(`${API_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const loginData = await loginRes.json();
            if (loginData.token) {
              localStorage.setItem('token', loginData.token);
              localStorage.setItem('currentUser', JSON.stringify(loginData.user));
            }

            setTimeout(() => {
              window.location.href = '../index.html';
            }, 1500);
          } else {
            showError('email', data.message || 'Registration failed');
          }
        } catch (err) {
          showError('email', 'Connection error. Is the backend running?');
          console.error(err);
        }
      }
    });
  }

  // =============== LOGIN ===============
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // Setup password strength for login too! (cool effect restored)
    setupPasswordStrength('loginPassword', '.password-strength'); // adjust selector if needed

    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      clearErrors();
      let isValid = true;

      if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
      }
      if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        isValid = false;
      }

      if (isValid) {
        try {
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            window.location.href = '../index.html';
          } else {
            showError('loginPassword', data.message || 'Invalid email or password');
          }
        } catch (err) {
          showError('loginPassword', 'Connection error. Is the backend running?');
          console.error(err);
        }
      }
    });
  }

  // =============== HELPERS ===============
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');

    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
    field.style.borderColor = 'var(--error)';
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-group input').forEach(input => {
      input.style.borderColor = 'var(--gray-medium)';
    });
  }
});