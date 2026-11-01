/* ==========================================================================
   Assignment #6: jQuery Interactions (Camp Horizon)
   ========================================================================== */

$(document).ready(function () {
  console.log("Camp Horizon: jQuery loaded successfully.");

  /* --------------------------------------------------------------------------
     TASK 1. Personalized Greeting & Theme Toggle (index.html)
     jQuery Methods: .on(), .val(), $.trim(), .text(), .toggleClass(), .attr()
     -------------------------------------------------------------------------- */
  const $nameInput = $("#userNameInput");
  const $greetBtn = $("#greetBtn");
  const $welcomeOutput = $("#welcomeOutput");

  $greetBtn.on("click", function () {
    const rawVal = $nameInput.val();
    const cleanName = $.trim(rawVal);

    if (cleanName === "") {
      $welcomeOutput
        .text("Please enter a valid name! Field cannot be empty.")
        .css("color", "#dc3545");
    } else {
      // Безопасная вставка через .text() исключает XSS
      $welcomeOutput
        .text("Welcome to Camp Horizon, " + cleanName + "! We are glad to see you.")
        .css("color", "#28a745");
    }
  });

  // Восстановление темы из localStorage
  const savedTheme = localStorage.getItem("campTheme");
  if (savedTheme === "dark") {
    $("body").addClass("dark-theme");
  }

  // Создание и добавление кнопки смены темы в навигацию
  const $themeToggleBtn = $("<button></button>")
    .attr("type", "button")
    .addClass("theme-toggle-btn")
    .text($("body").hasClass("dark-theme") ? "Switch to Light Theme" : "Switch to Dark Theme");

  const $navUl = $(".main-nav ul");
  if ($navUl.length && $("#themeToggleLi").length === 0) {
    const $li = $("<li></li>").attr("id", "themeToggleLi").append($themeToggleBtn);
    $navUl.append($li);
  }

  $themeToggleBtn.on("click", function () {
    $("body").toggleClass("dark-theme");
    const isDark = $("body").hasClass("dark-theme");

    if (isDark) {
      localStorage.setItem("campTheme", "dark");
      $(this).text("Switch to Light Theme");
    } else {
      localStorage.setItem("campTheme", "light");
      $(this).text("Switch to Dark Theme");
    }
  });


  /* --------------------------------------------------------------------------
     TASK 2. Animated FAQ Accordion (about.html & contact.html)
     jQuery Methods: .on(), .slideToggle(), .slideUp(), .stop(), .attr()
     -------------------------------------------------------------------------- */
  $(".faq-question").on("click", function () {
    const $button = $(this);
    const targetId = $button.attr("aria-controls");
    const $answer = targetId ? $("#" + targetId) : $button.next(".faq-answer");
    const isExpanded = $button.attr("aria-expanded") === "true";

    // Закрываем остальные открытые вопросы, предотвращая очередь анимации
    $(".faq-question").not($button).attr("aria-expanded", "false");
    $(".faq-answer").not($answer).stop(true, true).slideUp(250);

    // Переключаем выбранный вопрос
    $button.attr("aria-expanded", !isExpanded);
    $answer.stop(true, true).slideToggle(250);
  });


  /* --------------------------------------------------------------------------
     TASK 3. Combined Filter & Live Search (services.html)
     jQuery Methods: .on('input'), .each(), .text(), .toLowerCase(), .show(), .hide()
     -------------------------------------------------------------------------- */
  const $programSearch = $("#programSearch");
  const $resultsCount = $("#searchResultsCount");
  const $noResultsMsg = $("#noResultsMessage");
  const $programCards = $(".program-card");

  function filterCampPrograms() {
    const searchText = $.trim($programSearch.val()).toLowerCase();
    const activeCategory = $(".category-filter-btn.active").data("category") || "all";
    let visibleCount = 0;

    $programCards.each(function () {
      const $card = $(this);
      const title = $card.find("h3").text().toLowerCase();
      const desc = $card.find("p").text().toLowerCase();
      const cardCategory = $card.data("category") || "all";

      const matchesSearch = (title.indexOf(searchText) !== -1 || desc.indexOf(searchText) !== -1);
      const matchesCategory = (activeCategory === "all" || cardCategory === activeCategory);

      if (matchesSearch && matchesCategory) {
        $card.show();
        visibleCount++;
      } else {
        $card.hide();
      }
    });

    if (searchText !== "" || activeCategory !== "all") {
      $resultsCount.text("Showing " + visibleCount + " of " + $programCards.length + " programs");
    } else {
      $resultsCount.text("");
    }

    if (visibleCount === 0) {
      $noResultsMsg.removeClass("hidden").show();
    } else {
      $noResultsMsg.addClass("hidden").hide();
    }
  }

  if ($programSearch.length) {
    $programSearch.on("input", filterCampPrograms);

    $(".category-filter-btn").on("click", function () {
      $(".category-filter-btn").removeClass("active");
      $(this).addClass("active");
      filterCampPrograms();
    });

    $("#clearFiltersBtn").on("click", function () {
      $programSearch.val("");
      $(".category-filter-btn").removeClass("active");
      $('.category-filter-btn[data-category="all"]').addClass("active");
      filterCampPrograms();
    });
  }


  /* --------------------------------------------------------------------------
     TASK 4. Dynamic Content Management with Delegated Events (services.html)
     jQuery Methods: .on('submit'), .append(), .remove(), delegated .on('click')
     -------------------------------------------------------------------------- */
  const $favForm = $("#addFavForm");
  const $favInput = $("#favInput");
  const $favList = $("#favList");
  const $favCount = $("#favCount");
  const $favEmptyState = $("#favEmptyState");

  function syncFavCount() {
    const count = $favList.find(".fav-item").length;
    $favCount.text(count);
    if (count === 0) {
      $favEmptyState.show();
    } else {
      $favEmptyState.hide();
    }
  }

  if ($favForm.length) {
    $favForm.on("submit", function (e) {
      e.preventDefault();
      const itemText = $.trim($favInput.val());

      if (itemText === "") return;

      const $li = $("<li></li>").addClass("fav-item");
      const $span = $("<span></span>").text(itemText);
      const $btn = $("<button></button>")
        .attr("type", "button")
        .addClass("btn-remove")
        .text("Remove");

      $li.append($span).append($btn);
      $favList.append($li);

      $favInput.val("").focus();
      syncFavCount();
    });

    // Делегированное удаление для элементов списка
    $favList.on("click", ".btn-remove", function () {
      $(this).closest(".fav-item").remove();
      syncFavCount();
    });
  }


  /* --------------------------------------------------------------------------
     TASK 5. Form Validation & Simulation Feedback (contact.html)
     jQuery Methods: .on('submit'), .val(), $.trim(), .addClass(), .removeClass()
     -------------------------------------------------------------------------- */
  const $contactForm = $("#contactForm");
  const $contactSuccess = $("#contactSuccess");

  if ($contactForm.length) {
    $contactForm.on("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      const name = $.trim($("#contactName").val());
      const email = $.trim($("#contactEmail").val());
      const message = $.trim($("#contactMessage").val());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Сброс предыдущих ошибок
      $contactForm.find(".form-control").removeClass("is-invalid");

      if (name.length < 2) {
        isValid = false;
        $("#contactName").addClass("is-invalid");
      }

      if (!emailRegex.test(email)) {
        isValid = false;
        $("#contactEmail").addClass("is-invalid");
      }

      if (message.length < 10 || message.length > 500) {
        isValid = false;
        $("#contactMessage").addClass("is-invalid");
      }

      if (isValid) {
        $contactSuccess
          .stop(true, true)
          .removeClass("d-none")
          .html("<strong>Demonstration Successful:</strong> Thank you! Your enquiry has been verified via jQuery. (Notice: Frontend simulation only; no real message was transmitted).")
          .fadeIn(300);

        $contactForm[0].reset();
      } else {
        $contactSuccess.addClass("d-none");
      }
    });

    // Очистка красных рамок при начале исправления поля
    $contactForm.on("input", ".form-control", function () {
      $(this).removeClass("is-invalid");
    });
  }

  // 5.2. Валидация второй формы (Registration Form)
  const $regForm = $("#registrationForm");
  const $regSuccess = $("#registrationSuccess");

  if ($regForm.length) {
    $regForm.on("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      const fName = $.trim($("#firstName").val());
      const lName = $.trim($("#lastName").val());
      const email = $.trim($("#regEmail").val());
      const pwd = $("#password").val();
      const confirmPwd = $("#confirmPassword").val();
      const country = $("#countrySelect").val();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      $regForm.find(".form-control, .form-select").removeClass("is-invalid");

      if (fName.length < 2) { isValid = false; $("#firstName").addClass("is-invalid"); }
      if (lName.length < 2) { isValid = false; $("#lastName").addClass("is-invalid"); }
      if (!emailRegex.test(email)) { isValid = false; $("#regEmail").addClass("is-invalid"); }
      if (pwd.length < 8) { isValid = false; $("#password").addClass("is-invalid"); }
      if (confirmPwd.length < 8 || confirmPwd !== pwd) { isValid = false; $("#confirmPassword").addClass("is-invalid"); }
      if (!country) { isValid = false; $("#countrySelect").addClass("is-invalid"); }

      if (isValid) {
        $regSuccess
          .stop(true, true)
          .removeClass("d-none")
          .html("<strong>Registration Simulated:</strong> Camper registered successfully in demo mode. No payment charged.")
          .fadeIn(300);

        $regForm[0].reset();
      } else {
        $regSuccess.addClass("d-none");
      }
    });

    $("#resetBtn").on("click", function () {
      $regForm[0].reset();
      $regForm.find(".form-control, .form-select").removeClass("is-invalid");
      $regSuccess.addClass("d-none");
    });

    $regForm.on("input change", ".form-control, .form-select", function () {
      $(this).removeClass("is-invalid");
    });
  }

});
