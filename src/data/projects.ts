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

export const projects = githubProjects satisfies readonly Project[];
