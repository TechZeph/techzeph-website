module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("assets");

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

  return {
    dir: { input: ".", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
