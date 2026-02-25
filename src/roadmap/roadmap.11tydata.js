let rawPrivateBuild = process.env.PRIVATE_BUILD;
let isPrivateBuild =
  rawPrivateBuild == null
    ? true
    : String(rawPrivateBuild).toLowerCase() === "true";

module.exports = {
  eleventyComputed: {
    permalink: function() {
      if (!isPrivateBuild) {
        return false;
      }
      return "/roadmap/";
    }
  }
};
