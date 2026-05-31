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

const projectDisplayOverrides = {
	"techzeph-website": {
		status: "In Progress",
		summary: "This portfolio site",
	},
} satisfies Record<string, Partial<Pick<Project, "status" | "summary">>>;

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
