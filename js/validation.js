document.addEventListener('DOMContentLoaded', () => {
  
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (contactForm.checkValidity()) {
        if (contactSuccess) contactSuccess.classList.remove('d-none');
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      } else {
        if (contactSuccess) contactSuccess.classList.add('d-none');
        contactForm.classList.add('was-validated');
      }
    });
  }

  const regForm = document.getElementById('registrationForm');
  const regSuccess = document.getElementById('registrationSuccess');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const resetBtn = document.getElementById('resetBtn');

  function checkPasswordMatch() {
    if (confirmPassword && password) {
      if (confirmPassword.value && password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match");
      } else {
        confirmPassword.setCustomValidity("");
      }
    }
  }

  if (password && confirmPassword) {
    password.addEventListener('input', checkPasswordMatch);
    confirmPassword.addEventListener('input', checkPasswordMatch);
  }

  if (regForm) {
    regForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      checkPasswordMatch();

      if (regForm.checkValidity()) {
        if (regSuccess) regSuccess.classList.remove('d-none');
        regForm.reset();
        regForm.classList.remove('was-validated');
      } else {
        if (regSuccess) regSuccess.classList.add('d-none');
        regForm.classList.add('was-validated');
      }
    });
  }


  if (resetBtn && regForm) {
    resetBtn.addEventListener('click', () => {
      regForm.reset();
      regForm.classList.remove('was-validated');
      if (confirmPassword) confirmPassword.setCustomValidity("");
      if (regSuccess) regSuccess.classList.add('d-none');
    });
  }
});
