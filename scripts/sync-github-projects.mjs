import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const rootDir = resolve(new URL("..", import.meta.url).pathname);
const outputPath = resolve(rootDir, "src/data/github-projects.generated.ts");

async function loadEnvFile(fileName) {
	try {
		const envFile = await readFile(resolve(rootDir, fileName), "utf8");

		for (const line of envFile.split("\n")) {
			const trimmedLine = line.trim();

			if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
				continue;
			}

			const [key, ...valueParts] = trimmedLine.split("=");
			const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

			if (!process.env[key]) {
				process.env[key] = value;
			}
		}
	} catch {
		// Missing local env files are fine; CI should provide real environment variables.
	}
}

await loadEnvFile(".env");
await loadEnvFile(".env.local");

const username = process.env.GITHUB_USERNAME || "techzeph";
const token = process.env.GH_PROJECTS_TOKEN || process.env.GITHUB_TOKEN || "";
const includePrivate = process.env.GITHUB_INCLUDE_PRIVATE === "true";
const requiredTopics = (process.env.GITHUB_PROJECT_TOPICS || "portfolio,case-study,featured")
	.split(",")
	.map((topic) => topic.trim().toLowerCase())
	.filter(Boolean);

const headers = {
	Accept: "application/vnd.github+json",
	"X-GitHub-Api-Version": "2022-11-28",
	"User-Agent": "techzeph-portfolio-project-sync",
};

if (token) {
	headers.Authorization = `Bearer ${token}`;
}

async function fetchJson(url) {
	const response = await fetch(url, { headers });

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText} while fetching ${url}`);
	}

	return response.json();
}

async function fetchRepos() {
	const repos = [];
	const baseUrl =
		token && includePrivate
			? "https://api.github.com/user/repos?affiliation=owner&sort=updated&per_page=100"
			: `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

	for (let page = 1; page <= 10; page += 1) {
		const separator = baseUrl.includes("?") ? "&" : "?";
		const batch = await fetchJson(`${baseUrl}${separator}page=${page}`);

		if (!Array.isArray(batch) || batch.length === 0) {
			break;
		}

		repos.push(...batch);

		if (batch.length < 100) {
			break;
		}
	}

	return repos.filter((repo) => repo.owner?.login?.toLowerCase() === username.toLowerCase());
}

async function fetchProjectMetadata(repo) {
	const metadataPath = ".portfolio/project.json";
	const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${encodeURIComponent(metadataPath).replaceAll("%2F", "/")}?ref=${repo.default_branch}`;
	const content = await fetchJson(url);

	if (!content?.content) {
		return null;
	}

	const decoded = Buffer.from(content.content, "base64").toString("utf8");
	return JSON.parse(decoded);
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function titleize(value) {
	return value
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function compactTags(tags) {
	return [...new Set(tags.filter(Boolean).map(String))].slice(0, 8);
}

function statusFromTopics(topics) {
	if (topics.includes("prototype")) return "Prototype";
	if (topics.includes("concept")) return "Concept";
	if (topics.includes("learning-project")) return "Learning project";
	if (topics.includes("planned")) return "Planned";
	return "Built";
}

function normalizeProject(repo, metadata = {}) {
	const topics = Array.isArray(repo.topics) ? repo.topics.map((topic) => topic.toLowerCase()) : [];
	const language = repo.language || "";
	const updatedDate = repo.pushed_at || repo.updated_at;
	const updatedLabel = updatedDate ? new Date(updatedDate).toISOString().slice(0, 10) : "unknown";

	return {
		slug: slugify(metadata.slug || repo.name),
		title: metadata.title || titleize(repo.name),
		status: metadata.status || statusFromTopics(topics),
		type: metadata.type || language || "GitHub project",
		summary: metadata.summary || repo.description || "A public GitHub repository synced into the portfolio project index.",
		tags: compactTags(metadata.tags || [language, ...topics]),
		role: metadata.role || "Project owner",
		currentState:
			metadata.currentState ||
			`Public GitHub repository. Last pushed ${updatedLabel}.`,
		learned:
			metadata.learned ||
			"Add richer project notes in `.portfolio/project.json` inside the source repository.",
		next:
			metadata.next ||
			"Add project-specific metadata, screenshots, and a fuller case-study narrative.",
		repositoryUrl: repo.html_url,
		homepageUrl: repo.homepage || undefined,
		github: {
			name: repo.name,
			fullName: repo.full_name,
			defaultBranch: repo.default_branch,
			language,
			topics,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			updatedAt: repo.updated_at,
			pushedAt: repo.pushed_at,
			private: repo.private,
			archived: repo.archived,
		},
	};
}

function shouldInclude(repo, metadata) {
	if (repo.archived && metadata?.include !== true) {
		return false;
	}

	if (repo.fork && metadata?.include !== true) {
		return false;
	}

	if (metadata?.include === true) {
		return true;
	}

	const topics = Array.isArray(repo.topics) ? repo.topics.map((topic) => topic.toLowerCase()) : [];
	return requiredTopics.some((topic) => topics.includes(topic));
}

async function readExistingOutput() {
	try {
		return await readFile(outputPath, "utf8");
	} catch {
		return "export const githubProjects = [] as const;\n";
	}
}

async function writeProjects(projects) {
	const sortedProjects = projects.sort((a, b) => {
		const priorityA = Number(a.github?.stars || 0);
		const priorityB = Number(b.github?.stars || 0);
		return priorityB - priorityA || a.title.localeCompare(b.title);
	});

	const contents = [
		"// This file is generated by scripts/sync-github-projects.mjs.",
		"// Do not edit it by hand. Edit GitHub repo topics or `.portfolio/project.json` instead.",
		`export const githubProjects = ${JSON.stringify(sortedProjects, null, "\t")} as const;`,
		"",
	].join("\n");

	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, contents);
}

async function main() {
	try {
		const repos = await fetchRepos();
		const projects = [];

		for (const repo of repos) {
			let metadata = null;

			try {
				metadata = await fetchProjectMetadata(repo);
			} catch (error) {
				console.warn(
					`Skipping metadata for ${repo.full_name}: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}

			if (!shouldInclude(repo, metadata)) {
				continue;
			}

			projects.push(normalizeProject(repo, metadata || {}));
		}

		await writeProjects(projects);
		console.log(`Synced ${projects.length} GitHub project${projects.length === 1 ? "" : "s"}.`);
	} catch (error) {
		const existingOutput = await readExistingOutput();
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, existingOutput);

		console.warn("GitHub project sync failed; keeping existing generated project data.");
		console.warn(error instanceof Error ? error.message : error);

		if (process.env.GITHUB_PROJECT_SYNC_REQUIRED === "true") {
			process.exitCode = 1;
		}
	}
}

main();
