module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME" });

  let systemTags = new Set(["all", "nav", "post", "posts", "blog"]);
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

  eleventyConfig.addCollection("contentTags", function(collectionApi) {
    let posts = collectionApi
      .getFilteredByGlob("src/posts/**/*.{md,njk}")
      .sort(function(a, b) {
        return b.date - a.date;
      });

    let groups = new Map();

    posts.forEach(function(post) {
      let tags = post.data.tags || [];
      if (!Array.isArray(tags)) {
        tags = [tags];
      }

      tags.forEach(function(tag) {
        if (!tag || systemTags.has(tag)) {
          return;
        }

        if (!groups.has(tag)) {
          groups.set(tag, {
            tag: tag,
            slug: toSlug(tag),
            label: toLabel(tag),
            posts: []
          });
        }

        groups.get(tag).posts.push(post);
      });
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

  eleventyConfig.addFilter("isActiveNavItem", function(pageUrl, item) {
    if (!pageUrl || !item) {
      return false;
    }

    if (item.match === "exact") {
      return pageUrl === item.url;
    }

    if (item.match && item.match.startsWith("prefix:")) {
      let prefix = item.match.replace("prefix:", "");
      return pageUrl.startsWith(prefix);
    }

    return false;
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
