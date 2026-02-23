(function () {
  var searchInput = document.getElementById("tool-finder-search");
  var cards = Array.from(document.querySelectorAll(".tool-card"));
  var chips = Array.from(document.querySelectorAll(".tool-chip"));
  var countLabel = document.getElementById("tool-finder-count");
  var emptyState = document.getElementById("tool-finder-empty");

  if (!searchInput || !cards.length || !countLabel || !emptyState) {
    return;
  }

  var total = cards.length;

  var update = function () {
    var query = searchInput.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = card.getAttribute("data-search") || "";
      var match = !query || haystack.indexOf(query) !== -1;
      card.classList.toggle("hidden", !match);
      if (match) {
        visible += 1;
      }
    });

    if (!query) {
      countLabel.textContent = "Showing all categories.";
    } else {
      countLabel.textContent = "Showing " + visible + " of " + total + " categories.";
    }

    emptyState.classList.toggle("hidden", visible !== 0);

    chips.forEach(function (chip) {
      var chipQuery = (chip.getAttribute("data-query") || "").toLowerCase();
      var active = query && chipQuery === query;
      chip.classList.toggle("bg-slate-900", active);
      chip.classList.toggle("text-white", active);
      chip.classList.toggle("border-slate-900", active);
    });
  };

  searchInput.addEventListener("input", update);

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var query = chip.getAttribute("data-query") || "";
      searchInput.value = query;
      update();
      searchInput.focus();
    });
  });

  update();
})();
