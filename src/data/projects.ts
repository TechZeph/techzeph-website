import { githubProjects } from "./github-projects.generated";

export interface Project {
	slug: string;
	title: string;
	status: string;
	type: string;
	summary: string;
	tags: readonly string[];
	role: string;
	currentState: string;
	learned: string;
	next: string;
	repositoryUrl?: string;
	homepageUrl?: string;
	github?: {
		name: string;
		fullName: string;
		defaultBranch: string;
		language: string;
		topics: readonly string[];
		stars: number;
		forks: number;
		updatedAt: string;
		pushedAt: string;
		private: boolean;
		archived: boolean;
	};
}

const manualProjects = [
	{
		slug: "portfolio-foundation",
		title: "Portfolio foundation",
		status: "Built",
		type: "Personal site",
		summary:
			"The first pass at a fast Astro portfolio for projects, case studies, UI experiments, and writing.",
		tags: ["Astro", "Tailwind", "Static site"],
		role: "Solo build with AI-assisted iteration",
		currentState:
			"Homepage, theme system, shared layout, and early route structure are in place for review.",
		learned:
			"Keeping theme tokens semantic early makes future design experiments much easier to manage.",
		next:
			"Replace placeholder copy, add richer case-study content, and expand the component showcase.",
	},
	{
		slug: "case-study-system",
		title: "Project case studies",
		status: "Planned",
		type: "Content system",
		summary:
			"A repeatable structure for documenting what was built, what changed, and what still needs work.",
		tags: ["Content", "Docs", "Workflow"],
		role: "Planned site structure",
		currentState: "Placeholder project entry only.",
		learned: "Not started yet.",
		next: "Decide whether early case studies stay as data files or move into Astro content collections.",
	},
	{
		slug: "ui-component-lab",
		title: "UI component lab",
		status: "Planned",
		type: "Interface experiments",
		summary:
			"A future /ui area for reusable components, theme tests, and small interaction studies.",
		tags: ["Design system", "Components", "Prototypes"],
		role: "Planned design playground",
		currentState: "Placeholder route and concept only.",
		learned: "Not started yet.",
		next: "Add examples for buttons, cards, badges, panels, theme previews, and layout patterns.",
	},
] as const satisfies readonly Project[];

export const projects = [...githubProjects, ...manualProjects] satisfies readonly Project[];
