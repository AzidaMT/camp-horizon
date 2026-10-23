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

//TASK 3
const searchInput = document.querySelector("#programSearch");
  const resultsCount = document.querySelector("#searchResultsCount");
  const noResultsMsg = document.querySelector("#noResultsMessage");
  const programCards = document.querySelectorAll(".program-card");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filterText = searchInput.value.toLowerCase().trim();
      let matchCount = 0;

      programCards.forEach((card) => {
        const cardText = card.textContent.toLowerCase();

        if (cardText.includes(filterText)) {
          card.style.display = ""; 
          matchCount++;
        } else {
          card.style.display = "none"; 
        }
      });

      if (resultsCount) {
        if (filterText !== "") {
          resultsCount.textContent = `Showing ${matchCount} of ${programCards.length} programs`;
        } else {
          resultsCount.textContent = "";
        }
      }

      if (noResultsMsg) {
        if (matchCount === 0 && filterText !== "") {
          noResultsMsg.classList.remove("hidden");
        } else {
          noResultsMsg.classList.add("hidden");
        }
      }
    });
  }

  //TASK 4
const favForm = document.querySelector("#addFavForm");
  const favInput = document.querySelector("#favInput");
  const favList = document.querySelector("#favList");
  const favCount = document.querySelector("#favCount");

  let itemCount = 0;

  if (favForm) {
    favForm.addEventListener("submit", (event) => {
      event.preventDefault(); 

      const itemText = favInput.value.trim();
      if (itemText === "") return;

      const li = document.createElement("li");
      li.className = "fav-item";

      const span = document.createElement("span");
      span.textContent = itemText;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-remove";
      removeBtn.textContent = "Remove";

      removeBtn.addEventListener("click", () => {
        li.remove();
        itemCount--;
        if (favCount) favCount.textContent = itemCount;
      });

      li.appendChild(span);
      li.appendChild(removeBtn);
      if (favList) favList.appendChild(li);

      itemCount++;
      if (favCount) favCount.textContent = itemCount;
      favInput.value = "";
    });
  }
