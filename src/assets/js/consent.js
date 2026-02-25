(function () {
  var modalNode;

  function buildModal() {
    if (modalNode) {
      return modalNode;
    }

    modalNode = document.createElement("section");
    modalNode.id = "cookie-preferences-modal";
    modalNode.className = "fixed inset-0 z-[130] hidden items-center justify-center bg-slate-900/60 p-4";
    modalNode.innerHTML =
      '<div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">' +
      '<h2 class="text-xl font-semibold text-slate-900">Cookie settings</h2>' +
      '<p class="mt-2 text-sm text-slate-700">This site currently uses strictly necessary cookies only.</p>' +
      '<div class="mt-4 rounded-xl border border-slate-200 p-4">' +
      '<div class="flex items-start justify-between gap-4">' +
      '<div><p class="font-semibold text-slate-900">Strictly necessary</p><p class="text-sm text-slate-600">Required for core website functionality and preference controls.</p></div>' +
      '<span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">Always on</span>' +
      "</div>" +
      "</div>" +
      '<div class="mt-3 rounded-xl border border-slate-200 p-4">' +
      '<p class="font-semibold text-slate-900">Analytics cookies</p>' +
      '<p class="mt-1 text-sm text-slate-600">No optional analytics cookies are currently set by this site.</p>' +
      "</div>" +
      '<div class="mt-6 flex flex-wrap gap-2">' +
      '<button type="button" data-pref-action="close" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">Close</button>' +
      "</div>" +
      "</div>";

    modalNode.addEventListener("click", function (event) {
      if (event.target === modalNode) {
        closePreferences();
      }
    });

    modalNode.addEventListener("click", function (event) {
      var button = event.target.closest("[data-pref-action='close']");
      if (!button) {
        return;
      }
      closePreferences();
    });

    document.body.appendChild(modalNode);
    return modalNode;
  }

  function openPreferences() {
    var modal = buildModal();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closePreferences() {
    if (!modalNode) {
      return;
    }
    modalNode.classList.add("hidden");
    modalNode.classList.remove("flex");
  }

  function bindCookieSettingsButtons() {
    document.querySelectorAll("[data-open-cookie-preferences='true']").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        openPreferences();
      });
    });
  }

  function init() {
    window.techzephConsent = {
      getState: function () {
        return {
          analytics: false,
          mode: "necessary-only"
        };
      },
      isAnalyticsAllowed: function () {
        return false;
      },
      openPreferences: openPreferences
    };

    bindCookieSettingsButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
