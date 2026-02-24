const SYSTEM_TAGS = new Set(["all", "nav", "post", "posts", "blog"]);

const TAG_ALIASES = new Map([["electricians", "electrician"]]);

function canonicalTag(tag) {
  let value = String(tag || "").trim().toLowerCase();
  return TAG_ALIASES.get(value) || value;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function firstCategoryTag(data) {
  let tags = data.tags || [];
  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  for (let tag of tags) {
    let canonical = canonicalTag(tag);
    if (canonical && !SYSTEM_TAGS.has(canonical)) {
      return canonical;
    }
  }

  return "";
}

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      if (typeof data.permalink === "string" && data.permalink.length > 0) {
        return data.permalink;
      }

      let category = slugify(data.primaryCategory || firstCategoryTag(data));
      let slug = slugify(data.seoSlug || data.page?.fileSlug || data.title);

      if (!slug) {
        return false;
      }

      if (!category) {
        return `/best-ai-tools-uk/general/${slug}/`;
      }

      return `/best-ai-tools-uk/${category}/${slug}/`;
    }
  }
};
