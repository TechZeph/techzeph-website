(function () {
  var searchInput = document.getElementById("tool-finder-search");
  var resultsList = document.getElementById("tool-finder-results");
  var chips = Array.from(document.querySelectorAll(".tool-chip"));
  var countLabel = document.getElementById("tool-finder-count");
  var emptyState = document.getElementById("tool-finder-empty");
  var dataNode = document.getElementById("tool-finder-data");

  if (!searchInput || !resultsList || !countLabel || !emptyState || !dataNode) {
    return;
  }

  var posts = [];
  try {
    posts = JSON.parse(dataNode.textContent || "[]");
  } catch (error) {
    posts = [];
  }

  var activeIndex = -1;
  var visibleResults = [];

  var normalize = function (text) {
    return String(text || "")
      .toLowerCase()
      .trim();
  };

  var isSubsequence = function (needle, haystack) {
    if (!needle) {
      return false;
    }
    var i = 0;
    for (var j = 0; j < haystack.length && i < needle.length; j += 1) {
      if (needle[i] === haystack[j]) {
        i += 1;
      }
    }
    return i === needle.length;
  };

  var scorePost = function (post, query) {
    if (!query) {
      return 0;
    }

    var title = normalize(post.title);
    var description = normalize(post.description);
    var tags = (post.tags || []).map(normalize);
    var haystack = title + " " + description + " " + tags.join(" ");
    var score = 0;

    if (title.indexOf(query) !== -1) {
      score += 60;
      if (title.startsWith(query)) {
        score += 25;
      }
    }

    if (description.indexOf(query) !== -1) {
      score += 25;
    }

    tags.forEach(function (tag) {
      if (tag === query) {
        score += 50;
      } else if (tag.indexOf(query) !== -1) {
        score += 20;
      }
    });

    var tokens = query.split(/\s+/).filter(Boolean);
    tokens.forEach(function (token) {
      if (haystack.indexOf(token) !== -1) {
        score += 10;
      }
    });

    if (isSubsequence(query, title)) {
      score += 8;
    }

    return score;
  };

  var renderResults = function (results) {
    resultsList.innerHTML = "";

    results.forEach(function (result, index) {
      var item = document.createElement("li");
      item.id = "tool-result-" + index;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
      item.className =
        "panel p-5 transition " +
        (index === activeIndex ? "ring-2 ring-blue-300" : "");

      var tags = (result.tags || [])
        .slice(0, 3)
        .map(function (tag) {
          return '<span class="chip !px-2 !py-0.5 !text-xs">' + tag + "</span>";
        })
        .join(" ");

      item.innerHTML =
        '<a class="block" href="' +
        result.url +
        '" data-result-index="' +
        index +
        '">' +
        '<h2 class="text-xl font-semibold text-slate-900 hover:underline">' +
        result.title +
        "</h2>" +
        (result.description
          ? '<p class="mt-2 text-sm text-slate-700">' + result.description + "</p>"
          : "") +
        (tags ? '<div class="mt-3 flex flex-wrap gap-2">' + tags + "</div>" : "") +
        "</a>";

      resultsList.appendChild(item);
    });
  };

  var update = function () {
    var query = normalize(searchInput.value);

    if (!query) {
      visibleResults = [];
      activeIndex = -1;
      renderResults([]);
      countLabel.textContent = "Type to search posts.";
      emptyState.classList.add("hidden");
      searchInput.setAttribute("aria-expanded", "false");
      searchInput.removeAttribute("aria-activedescendant");
      return;
    }

    visibleResults = posts
      .map(function (post) {
        return {
          post: post,
          score: scorePost(post, query)
        };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 10)
      .map(function (entry) {
        return entry.post;
      });

    if (activeIndex >= visibleResults.length) {
      activeIndex = -1;
    }

    renderResults(visibleResults);
    countLabel.textContent = "Showing " + visibleResults.length + " matching posts.";
    emptyState.classList.toggle("hidden", visibleResults.length !== 0);
    searchInput.setAttribute("aria-expanded", visibleResults.length > 0 ? "true" : "false");
    if (activeIndex >= 0) {
      searchInput.setAttribute("aria-activedescendant", "tool-result-" + activeIndex);
    } else {
      searchInput.removeAttribute("aria-activedescendant");
    }
  };

  var moveActive = function (direction) {
    if (!visibleResults.length) {
      return;
    }

    if (activeIndex === -1) {
      activeIndex = direction > 0 ? 0 : visibleResults.length - 1;
    } else {
      activeIndex = (activeIndex + direction + visibleResults.length) % visibleResults.length;
    }

    renderResults(visibleResults);
    searchInput.setAttribute("aria-activedescendant", "tool-result-" + activeIndex);
  };

  searchInput.addEventListener("input", function () {
    activeIndex = -1;
    update();
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }

    if (event.key === "Enter") {
      if (!visibleResults.length) {
        return;
      }
      event.preventDefault();
      var targetIndex = activeIndex >= 0 ? activeIndex : 0;
      window.location.href = visibleResults[targetIndex].url;
      return;
    }

    if (event.key === "Escape") {
      searchInput.value = "";
      activeIndex = -1;
      update();
    }
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      searchInput.value = chip.getAttribute("data-query") || "";
      activeIndex = -1;
      update();
      searchInput.focus();
    });
  });

  resultsList.addEventListener("mousemove", function (event) {
    var anchor = event.target.closest("[data-result-index]");
    if (!anchor) {
      return;
    }
    var idx = Number(anchor.getAttribute("data-result-index"));
    if (!Number.isNaN(idx) && idx !== activeIndex) {
      activeIndex = idx;
      renderResults(visibleResults);
      searchInput.setAttribute("aria-activedescendant", "tool-result-" + activeIndex);
    }
  });

  update();
})();
