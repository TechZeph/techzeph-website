const SYSTEM_TAGS = new Set(["all", "nav", "post", "posts", "blog"]);
const DEFAULT_BUSINESS_TYPE = "trades";
const CONTENT_TYPE_ALIASES = new Map([
  ["toolreview", "toolReview"],
  ["tool", "toolReview"],
  ["toplist", "topList"],
  ["top", "topList"],
  ["comparison", "comparison"],
  ["compare", "comparison"]
]);

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

function normalizeContentType(value) {
  let raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "toolReview";
  }
  return CONTENT_TYPE_ALIASES.get(raw) || "toolReview";
}

module.exports = {
  eleventyComputed: {
    businessType: (data) => {
      let type = slugify(data.businessType || DEFAULT_BUSINESS_TYPE);
      return type || DEFAULT_BUSINESS_TYPE;
    },
    contentType: (data) => {
      return normalizeContentType(data.contentType);
    },
    permalink: (data) => {
      if (typeof data.permalink === "string" && data.permalink.length > 0) {
        return data.permalink;
      }

      let contentType = normalizeContentType(data.contentType);
      let businessType = slugify(data.businessType || DEFAULT_BUSINESS_TYPE) || DEFAULT_BUSINESS_TYPE;
      let category = slugify(data.primaryCategory || firstCategoryTag(data));
      let slug = slugify(data.toolSlug || data.seoSlug || data.page?.fileSlug || data.title);

      if (contentType === "comparison") {
        let comparisonA = slugify(data.comparisonA);
        let comparisonB = slugify(data.comparisonB);
        let comparisonSlug = comparisonA && comparisonB ? comparisonA + "-vs-" + comparisonB : slugify(data.seoSlug || data.page?.fileSlug || data.title);
        if (!comparisonSlug) {
          return false;
        }
        return `/best-ai-tools-uk/${comparisonSlug}/`;
      }

      if (!category) {
        category = "general";
      }

      if (contentType === "topList") {
        let listTopic = slugify(data.listTopic || data.seoSlug || data.page?.fileSlug || data.title);
        if (!listTopic) {
          return false;
        }
        return `/best-ai-tools-uk/${businessType}/${category}/top-5-${listTopic}/`;
      }

      if (!slug) {
        return false;
      }

      return `/best-ai-tools-uk/${businessType}/${category}/${slug}/`;
    }
  }
};
