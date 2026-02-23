module.exports = {
  primary: [
    { label: "Home", url: "/", match: "exact" },
    { label: "Tool Finder", url: "/tools/", match: "prefix:/tools/" },
    { label: "Categories", url: "/categories/", match: "prefix:/categories/" },
    { label: "Blog", url: "/blog/", match: "prefix:/blog/" },
    { label: "About", url: "/about/", match: "exact" }
  ],
  categories: [
    {
      label: "Quotes & Invoicing",
      url: "/categories/quotes-invoicing/",
      description: "Generate faster quotes and tighten margin control."
    },
    {
      label: "Scheduling & Dispatch",
      url: "/categories/scheduling-dispatch/",
      description: "Plan jobs, routes, and team availability."
    },
    {
      label: "Customer Comms",
      url: "/categories/customer-comms/",
      description: "Calls, SMS, WhatsApp, and follow-up automation."
    },
    {
      label: "Marketing",
      url: "/categories/marketing/",
      description: "Local SEO, ads, and social content support."
    },
    {
      label: "Design & Docs",
      url: "/categories/design-docs/",
      description: "Proposals, plans, and document workflows."
    },
    {
      label: "Ops & Admin",
      url: "/categories/ops-admin/",
      description: "Compliance, finance, and operational tasks."
    },
    {
      label: "AI Assistants",
      url: "/categories/ai-assistants/",
      description: "General copilots for small UK teams."
    }
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
