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
