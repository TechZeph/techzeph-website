import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { githubProjects } from "./github-projects.generated";

export interface Project {
	slug: string;
	title: string;
	status: string;
	type: string;
	summary: string;
	tags: readonly string[];
	skills?: readonly string[];
	complexity?: {
		level: string;
		score: number;
		signals: readonly string[];
		notes?: string;
	};
	role: string;
	currentState: string;
	done: readonly string[];
	nextSteps: readonly string[];
	caseStudy?: {
		problem?: string;
		approach?: string;
		outcome?: string;
	};
	highlights?: readonly string[];
	learned?: readonly string[];
	related?: readonly string[]; // slugs of other projects
	featured?: boolean;
	order?: number;
	category?: string;
	demoUrl?: string;
	started?: string;
	shipped?: string;
	ogImage?: string; // explicit social-image override
	repositoryUrl?: string;
	homepageUrl?: string;
	github?: {
		name: string;
		fullName: string;
		defaultBranch: string;
		language: string;
		languages?: readonly {
			name: string;
			bytes: number;
			percentage: number;
		}[];
		topics: readonly string[];
		sizeKb?: number;
		stars: number;
		forks: number;
		updatedAt: string;
		pushedAt: string;
		private: boolean;
		archived: boolean;
		license?: {
			spdxId: string;
			name: string;
			url?: string;
		};
		openIssues?: number; // includes PRs
		socialImage?: string; // opengraph.githubassets.com fallback, always present
		latestRelease?: {
			tag: string;
			name: string;
			url: string;
			publishedAt: string;
		};
	};
}

function uncheckedTodoItems(sectionName: string) {
	try {
		const todo = readFileSync(resolve(process.cwd(), "TODO.md"), "utf8");
		const sectionPattern = new RegExp(
			`^## ${sectionName}\\s*\\n([\\s\\S]*?)(?=^## |\\z)`,
			"m",
		);
		const section = todo.match(sectionPattern)?.[1] ?? "";

		return section
			.split("\n")
			.map((line) => line.match(/^- \[ \] (.+)$/)?.[1]?.trim())
			.filter((item): item is string => Boolean(item));
	} catch {
		return [];
	}
}

const siteTodoNextSteps = [
	...uncheckedTodoItems("Now"),
	...uncheckedTodoItems("Later"),
];

const projectDisplayOverrides = {
	"techzeph-website": {
		status: "In Progress",
		summary: "This portfolio site",
		...(siteTodoNextSteps.length > 0 ? { nextSteps: siteTodoNextSteps } : {}),
	},
} satisfies Record<string, Partial<Pick<Project, "status" | "summary" | "nextSteps">>>;

export const projects = githubProjects
	.map((project) => ({
		...project,
		...projectDisplayOverrides[project.slug],
	}))
	.sort((a, b) => {
		if (a.slug === "techzeph-website") return -1;
		if (b.slug === "techzeph-website") return 1;

		return 0;
	}) satisfies readonly Project[];

// Convenience re-export so callers can reach the topic aggregation from the
// projects module. The canonical logic + vocabulary live in ./topics and
// ./topics.taxonomy.json (the single source of truth shared with
// scripts/derive-topics.mjs).
export { getAllTopics, getTopic, getRelatedTopics, canonicalTopicSlug } from "./topics";
export type { Topic } from "./topics";
