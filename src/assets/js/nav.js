(function () {
  var body = document.body;
  var header = document.getElementById("site-header");
  var menu = document.getElementById("mobile-menu");
  var openButton = document.getElementById("mobile-menu-toggle");
  var closeButton = document.getElementById("mobile-menu-close");
  var backdrop = document.getElementById("mobile-menu-backdrop");
  var lastFocusedElement = null;

  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add("shadow-sm");
      } else {
        header.classList.remove("shadow-sm");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (!menu || !openButton || !closeButton || !backdrop) {
    return;
  }

  var getFocusableElements = function () {
    return menu.querySelectorAll(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
  };

  var closeMenu = function () {
    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");
    openButton.setAttribute("aria-expanded", "false");
    body.classList.remove("overflow-hidden");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  var openMenu = function () {
    lastFocusedElement = document.activeElement;
    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
    body.classList.add("overflow-hidden");
    var focusableElements = getFocusableElements();
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  };

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      closeMenu();
    }

    if (event.key === "Tab" && !menu.classList.contains("hidden")) {
      var focusableElements = getFocusableElements();
      if (!focusableElements.length) {
        return;
      }

      var first = focusableElements[0];
      var last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
