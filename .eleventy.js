module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("CNAME");

  return {
    dir: { input: ".", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
