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

export const projects = githubProjects satisfies readonly Project[];
