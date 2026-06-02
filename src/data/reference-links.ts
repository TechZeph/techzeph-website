const referenceLinks: Record<string, string> = {
	astro: "https://docs.astro.build/",
	"astro routing": "https://docs.astro.build/en/guides/routing/",
	css: "https://developer.mozilla.org/en-US/docs/Web/CSS",
	"developer workflow": "https://en.wikipedia.org/wiki/Workflow",
	documentation: "https://en.wikipedia.org/wiki/Documentation",
	"generated project data": "https://en.wikipedia.org/wiki/Data_transformation",
	github: "https://github.com/",
	"github api": "https://docs.github.com/en/rest",
	"github api integration": "https://docs.github.com/en/rest",
	"github portfolio workflow": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics",
	"metadata modeling": "https://en.wikipedia.org/wiki/Metadata",
	portfolio: "https://en.wikipedia.org/wiki/Portfolio",
	"portfolio metadata": "https://en.wikipedia.org/wiki/Metadata",
	"responsive ui components": "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
	"static site": "https://en.wikipedia.org/wiki/Static_web_page",
	"static site generation": "https://en.wikipedia.org/wiki/Static_site_generator",
	"tailwind css": "https://tailwindcss.com/docs",
	tailwindcss: "https://tailwindcss.com/docs",
	"technical documentation": "https://en.wikipedia.org/wiki/Technical_documentation",
	"template design": "https://en.wikipedia.org/wiki/Template_processor",
};

function normalizeReferenceLabel(label: string) {
	return label.trim().toLowerCase();
}

export function getReferenceUrl(label: string) {
	const key = normalizeReferenceLabel(label);

	if (referenceLinks[key]) {
		return referenceLinks[key];
	}

	return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(label.trim())}`;
}
