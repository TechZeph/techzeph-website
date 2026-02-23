module.exports = {
  primary: [
    { label: "Home", url: "/", match: "exact" },
    { label: "Tool Finder", url: "/tools/", match: "prefix:/tools/" },
    { label: "Categories", url: "/categories/", match: "prefix:/categories/" },
    { label: "About", url: "/about/", match: "exact" }
  ],
  cta: {
    label: "Compare tools",
    url: "/tools/"
  },
  footer: [
    { label: "Disclosure", url: "/disclosure/" },
    { label: "Privacy", url: "/privacy/" },
    { label: "Contact", url: "/contact/" }
  ]
};
