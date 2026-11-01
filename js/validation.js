/* ==========================================================================
   Assignment #6: Consolidated jQuery Core (Camp Horizon)
   Covers Tasks 1 to 5 with backward compatibility
   ========================================================================== */

$(document).ready(function () {
  console.log("Camp Horizon: jQuery loaded successfully.");

  /* --------------------------------------------------------------------------
     TASK 1. Personalized Greeting & Theme Toggle (index.html)
     jQuery Methods: .on(), .val(), $.trim(), .text(), .css(), .toggleClass()
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
      // Исключаем XSS через метод .text()
      $welcomeOutput
        .text("Welcome to Camp Horizon, " + cleanName + "! We are glad to see you.")
        .css("color", "#28a745");
    }
  });

  // Загрузка темы из памяти браузера
  const savedTheme = localStorage.getItem("campTheme");
  if (savedTheme === "dark") {
    $("body").addClass("dark-theme");
  }

  // Создание кнопки смены темы в панели навигации
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
     TASK 2. Animated FAQ Accordion & Fade Status (contact.html & about.html)
     jQuery Methods: .on(), .slideToggle(), .slideUp(), .stop(), .fadeIn(), .fadeOut()
     -------------------------------------------------------------------------- */
  // 2.1 Аккордеон
  $(document).on("click", ".faq-question", function () {
    const $button = $(this);
    const targetId = $button.attr("aria-controls");
    const $answer = targetId ? $("#" + targetId) : $button.next(".faq-answer");
    const isExpanded = $button.attr("aria-expanded") === "true";

    // Сворачиваем соседние вопросы и предотвращаем очередь кликов через .stop()
    $(".faq-question").not($button).attr("aria-expanded", "false");
    $(".faq-answer").not($answer).stop(true, true).slideUp(250);

    // Раскрываем / скрываем выбранный
    $button.attr("aria-expanded", !isExpanded);
    $answer.stop(true, true).slideToggle(250);
  });

// 2.2 Fade-эффект подписки на about.html
  $(document).on("click", "#newsletterBtn", function (e) {
    e.preventDefault();
    const rawVal = $("#newsletterEmail").val() || "";
    const emailVal = $.trim(rawVal);
    const $status = $("#newsletterStatus");

    // Надежная проверка email без сбоев из-за спецсимволов или пробелов
    const hasAt = emailVal.indexOf("@") > 0;
    const hasDot = emailVal.lastIndexOf(".") > emailVal.indexOf("@") + 1;
    const isValidEmail = hasAt && hasDot && emailVal.length >= 6;

    if (isValidEmail) {
      $status
        .stop(true, true)
        .css({ "color": "#28a745", "display": "none" })
        .text("Subscribed successfully! Welcome to Camp Horizon newsletter.")
        .fadeIn(300)
        .delay(3000)
        .fadeOut(400);

      $("#newsletterEmail").val("");
    } else {
      $status
        .stop(true, true)
        .css({ "color": "#dc3545", "display": "none" })
        .text("Please enter a valid email address.")
        .fadeIn(300)
        .delay(3000)
        .fadeOut(400);
    }
  });


  /* --------------------------------------------------------------------------
     TASK 3. Combined Filtering & Live Search (services.html)
     jQuery Methods: .on('input'), .each(), .text(), .toLowerCase(), .show(), .hide()
     -------------------------------------------------------------------------- */
  const $programSearch = $("#programSearch");
  const $resultsCount = $("#searchResultsCount");
  const $noResultsMsg = $("#noResultsMessage");
  const $programCards = $(".program-card");

  function filterCampPrograms() {
    const searchText = $.trim($programSearch.val()).toLowerCase();
    const activeCategory = $(".category-filter-btn.active").data("category") || "all";
    let matchCount = 0;

    $programCards.each(function () {
      const $card = $(this);
      const title = $card.find("h3").text().toLowerCase();
      const desc = $card.find("p").text().toLowerCase();
      const cardCategory = $card.data("category") || "all";

      const matchesQuery = (title.indexOf(searchText) !== -1 || desc.indexOf(searchText) !== -1);
      const matchesCategory = (activeCategory === "all" || cardCategory === activeCategory);

      if (matchesQuery && matchesCategory) {
        $card.show();
        matchCount++;
      } else {
        $card.hide();
      }
    });

    if (searchText !== "" || activeCategory !== "all") {
      $resultsCount.text("Showing " + matchCount + " of " + $programCards.length + " programs");
    } else {
      $resultsCount.text("");
    }

    if (matchCount === 0) {
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
     TASK 4. Dynamic List Management with Delegated Events (services.html)
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
     jQuery Methods: .on('submit'), .val(), regex, .addClass(), .removeClass(), .slideDown()
     -------------------------------------------------------------------------- */
  // 5.1. Contact Us Form
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
          .html("<strong>Demonstration Successful:</strong> Thank you! Your contact message has been verified and processed via jQuery. (Notice: Frontend demonstration mode; no real server transmission occurred).")
          .slideDown(300);

        $contactForm[0].reset();
      } else {
        $contactSuccess.slideUp(200);
      }
    });

    $contactForm.on("input", ".form-control", function () {
      $(this).removeClass("is-invalid");
    });
  }

  // 5.2. Registration Form
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
          .html("<strong>Registration Simulated:</strong> All fields are valid! Camper registered in frontend demonstration mode.")
          .slideDown(300);

        $regForm[0].reset();
      } else {
        $regSuccess.slideUp(200);
      }
    });

    $("#resetBtn").on("click", function () {
      $regForm[0].reset();
      $regForm.find(".form-control, .form-select").removeClass("is-invalid");
      $regSuccess.slideUp(200);
    });

    $regForm.on("input change", ".form-control, .form-select", function () {
      $(this).removeClass("is-invalid");
    });
  }

});
