const fs = require("node:fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME" });

  let systemTags = new Set(["all", "nav", "post", "posts", "blog"]);
  let tagAliases = new Map([
    ["electricians", "electrician"]
  ]);

  let canonicalTag = function(tag) {
    let value = String(tag || "").trim().toLowerCase();
    return tagAliases.get(value) || value;
  };

  let toSlug = function(tag) {
    return String(tag)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  let toLabel = function(tag) {
    return String(tag)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, function(ch) {
        return ch.toUpperCase();
      });
  };

  let primaryCategoryForPost = function(postData) {
    let category = canonicalTag(postData.primaryCategory || "");
    if (!category || systemTags.has(category)) {
      return "";
    }
    return category;
  };

  eleventyConfig.addCollection("businessCategories", function(collectionApi) {
    let posts = collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .sort(function(a, b) {
        return b.date - a.date;
      });

    let groups = new Map();

    posts.forEach(function(post) {
      let category = primaryCategoryForPost(post.data);
      if (!category) {
        return;
      }

      if (!groups.has(category)) {
        groups.set(category, {
          tag: category,
          slug: toSlug(category),
          label: toLabel(category),
          posts: []
        });
      }

      groups.get(category).posts.push(post);
    });

    return Array.from(groups.values())
      .map(function(group) {
        return {
          tag: group.tag,
          slug: group.slug,
          label: group.label,
          posts: group.posts,
          count: group.posts.length
        };
      })
      .sort(function(a, b) {
        return a.label.localeCompare(b.label);
      });
  });

  eleventyConfig.addCollection("searchPosts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .sort(function(a, b) {
        return b.date - a.date;
      })
      .map(function(post) {
        let tags = post.data.tags || [];
        if (!Array.isArray(tags)) {
          tags = [tags];
        }

        let canonicalTags = Array.from(
          new Set(
            tags
              .map(canonicalTag)
              .filter(function(tag) {
                return tag && !systemTags.has(tag);
              })
          )
        );

        return {
          title: post.data.title || "",
          description: post.data.description || "",
          url: post.url || "",
          tags: canonicalTags
        };
      });
  });

  eleventyConfig.addCollection("electricianHub", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .filter(function(post) {
        let primaryCategory = primaryCategoryForPost(post.data);
        if (primaryCategory === "electrician") {
          return true;
        }

        let tags = post.data.tags || [];
        if (!Array.isArray(tags)) {
          tags = [tags];
        }

        return tags.some(function(tag) {
          return canonicalTag(tag) === "electrician";
        });
      })
      .sort(function(a, b) {
        return b.date - a.date;
      });
  });

  eleventyConfig.addFilter("activeClass", function(pageUrl, item) {
    let active = false;
    if (pageUrl && item) {
      if (item.match === "exact") {
        active = pageUrl === item.url;
      } else if (item.match && item.match.startsWith("prefix:")) {
        let prefix = item.match.replace("prefix:", "");
        active = pageUrl.startsWith(prefix);
      }
    }

    if (active) {
      return "text-slate-900 font-semibold underline decoration-2 underline-offset-8";
    }
    return "text-slate-600 hover:text-slate-900";
  });

  eleventyConfig.addFilter("tagHref", function(tag) {
    return "/categories/" + toSlug(tag) + "/";
  });

  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });

  let toDateObject = function(value) {
    if (!value) {
      return null;
    }

    let date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  let toIsoDate = function(value) {
    let date = toDateObject(value);
    if (!date) {
      return "";
    }

    return date.toISOString();
  };

  eleventyConfig.addFilter("dateDmy", function(value) {
    if (!value) {
      return "";
    }

    let isoDate = "";
    if (value && typeof value.toISOString === "function") {
      isoDate = value.toISOString().slice(0, 10);
    } else {
      isoDate = String(value).trim().slice(0, 10);
    }

    let match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      return String(value);
    }

    return match[3] + "-" + match[2] + "-" + match[1];
  });

  eleventyConfig.addFilter("sitemapLastmod", function(entry) {
    if (!entry || !entry.data) {
      return "";
    }

    let manualDate = toIsoDate(entry.data.lastUpdated || entry.data.lastVerified);
    if (manualDate) {
      return manualDate;
    }

    if (entry.inputPath) {
      try {
        let stat = fs.statSync(entry.inputPath);
        let fileModified = toIsoDate(stat.mtime);
        if (fileModified) {
          return fileModified;
        }
      } catch (error) {
        // Ignore missing file paths and continue to fallback.
      }
    }

    return toIsoDate(entry.date);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
