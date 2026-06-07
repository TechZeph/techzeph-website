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

async function fetchPortfolioJson(repo, metadataPath) {
	const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${encodeURIComponent(metadataPath).replaceAll("%2F", "/")}?ref=${repo.default_branch}`;
	const content = await fetchJson(url);

	if (!content?.content) {
		return null;
	}

	const decoded = Buffer.from(content.content, "base64").toString("utf8");
	return JSON.parse(decoded);
}

async function fetchProjectMetadata(repo) {
	return fetchPortfolioJson(repo, ".portfolio/project.json");
}

async function fetchProgressMetadata(repo) {
	return fetchPortfolioJson(repo, ".portfolio/progress.json");
}

async function fetchLanguages(repo) {
	const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`;
	const languages = await fetchJson(url);

	return languages && typeof languages === "object" && !Array.isArray(languages) ? languages : {};
}

async function fetchCommits(repo) {
	const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?sha=${encodeURIComponent(repo.default_branch)}&per_page=8`;
	const commits = await fetchJson(url);

	return Array.isArray(commits) ? commits : [];
}

async function fetchLatestRelease(repo) {
	const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/releases/latest`;
	const release = await fetchJson(url); // null on 404 (no releases) - no throw

	if (!release) {
		return undefined;
	}

	return {
		tag: release.tag_name,
		name: release.name || release.tag_name,
		url: release.html_url,
		publishedAt: release.published_at,
	};
}

// license + open issues need NO extra request: both ride the repo list payload.
function licenseFrom(repo) {
	const license = repo.license;

	if (!license || !license.spdx_id || license.spdx_id === "NOASSERTION") {
		return undefined;
	}

	return { spdxId: license.spdx_id, name: license.name, url: license.url || undefined };
}

// GitHub auto-generates a social card for EVERY repo (no auth, no API call).
function socialImageFor(repo) {
	return `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;
}

// Trim a free-text field; undefined when empty so the renderer can skip it.
function cleanText(value) {
	const text = String(value ?? "").trim();
	return text.length > 0 ? text : undefined;
}

function normalizeCaseStudy(caseStudy) {
	if (!caseStudy || typeof caseStudy !== "object") {
		return undefined;
	}

	const problem = cleanText(caseStudy.problem);
	const approach = cleanText(caseStudy.approach);
	const outcome = cleanText(caseStudy.outcome);

	if (!problem && !approach && !outcome) {
		return undefined;
	}

	return { problem, approach, outcome };
}

// Short list helper for the new arrays (dedupe + cap). Mirrors normalizeList's
// discipline but with a configurable cap and no fallback.
function compactStrings(value, max) {
	if (!Array.isArray(value) || value.length === 0) {
		return undefined;
	}

	const items = [...new Set(value.map((item) => String(item).trim()).filter(Boolean))].slice(0, max);
	return items.length > 0 ? items : undefined;
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

function compactSkills(skills) {
	return [...new Set(skills.filter(Boolean).map(String))].slice(0, 12);
}

function normalizeList(value, fallback) {
	const values = Array.isArray(value) ? value : value ? [value] : fallback;

	return values
		.map((item) => String(item).trim())
		.filter(Boolean)
		.slice(0, 8);
}

function languageBreakdown(languages) {
	const total = Object.values(languages).reduce((sum, value) => sum + Number(value || 0), 0);

	return Object.entries(languages)
		.sort(([, a], [, b]) => Number(b) - Number(a))
		.map(([name, bytes]) => ({
			name,
			bytes: Number(bytes),
			percentage: total > 0 ? Math.round((Number(bytes) / total) * 1000) / 10 : 0,
		}));
}

function inferSkills(topics, languages) {
	const topicSkills = {
		astro: "Astro",
		tailwindcss: "Tailwind CSS",
		typescript: "TypeScript",
		javascript: "JavaScript",
		"web-development": "Web development",
		portfolio: "Portfolio systems",
		"static-site": "Static sites",
		automation: "Automation",
		"ui-components": "UI components",
	};

	return compactSkills([
		...languages.map((language) => language.name),
		...topics.map((topic) => topicSkills[topic] || titleize(topic)),
	]);
}

function estimateComplexity(repo, topics, languages) {
	const languageCount = languages.length;
	const sizeKb = Number(repo.size || 0);
	let score = 1;
	const signals = [];

	if (languageCount > 0) {
		signals.push(`${languageCount} detected language${languageCount === 1 ? "" : "s"}`);
	}

	if (languageCount >= 4) score += 2;
	else if (languageCount >= 2) score += 1;

	if (topics.length >= 6) score += 1;
	if (sizeKb >= 1000) score += 2;
	else if (sizeKb >= 250) score += 1;
	if (repo.homepage) score += 1;

	if (topics.length > 0) {
		signals.push(`${topics.length} GitHub topic${topics.length === 1 ? "" : "s"}`);
	}

	if (sizeKb > 0) {
		signals.push(`${sizeKb.toLocaleString("en-GB")} KB repository size`);
	}

	if (repo.homepage) {
		signals.push("live site or homepage linked");
	}

	const level = score >= 5 ? "Layered" : score >= 3 ? "Moderate" : "Focused";

	return {
		level,
		score,
		signals,
	};
}

function statusFromTopics(topics) {
	if (topics.includes("prototype")) return "Prototype";
	if (topics.includes("concept")) return "Concept";
	if (topics.includes("learning-project")) return "Learning project";
	if (topics.includes("planned")) return "Planned";
	return "Built";
}

function cleanCommitSubject(message) {
	const subject = String(message || "")
		.split("\n")[0]
		.trim()
		.replace(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?:\s*/i, "")
		.replace(/^[a-z]/, (letter) => letter.toUpperCase());

	return subject.endsWith(".") ? subject : `${subject}.`;
}

function doneFromCommits(commits, fallback) {
	const done = [
		...new Set(
			commits
				.map((commit) => cleanCommitSubject(commit?.commit?.message))
				.filter((subject) => subject.length > 1 && !subject.startsWith("Merge ")),
		),
	].slice(0, 5);

	return done.length > 0 ? done : fallback;
}

function normalizeProject(repo, metadata = {}, progress = {}, languages = {}, commits = []) {
	const topics = Array.isArray(repo.topics) ? repo.topics.map((topic) => topic.toLowerCase()) : [];
	const language = repo.language || "";
	const languagesUsed = languageBreakdown(languages);
	const updatedDate = repo.pushed_at || repo.updated_at;
	const updatedLabel = updatedDate ? new Date(updatedDate).toISOString().slice(0, 10) : "unknown";
	const skills = compactSkills(metadata.skills || inferSkills(topics, languagesUsed));
	const complexity = {
		...estimateComplexity(repo, topics, languagesUsed),
		notes: metadata.complexityNotes || undefined,
	};

	return {
		slug: slugify(metadata.slug || repo.name),
		title: metadata.title || titleize(repo.name),
		status: metadata.status || statusFromTopics(topics),
		type: metadata.type || language || "GitHub project",
		summary: metadata.summary || repo.description || "A public GitHub repository synced into the portfolio project index.",
		tags: compactTags(metadata.tags || [language, ...topics]),
		skills,
		complexity,
		role: metadata.role || "Project owner",
		currentState:
			metadata.currentState ||
			`Public GitHub repository. Last pushed ${updatedLabel}.`,
		// done: an explicit doneOverride wins; otherwise stay commit-derived.
		done: Array.isArray(metadata.doneOverride) && metadata.doneOverride.length > 0
			? normalizeList(metadata.doneOverride, [])
			: normalizeList(doneFromCommits(commits, [
				metadata.currentState || `Public GitHub repository. Last pushed ${updatedLabel}.`,
			]), [
				metadata.currentState || `Public GitHub repository. Last pushed ${updatedLabel}.`,
			]),
		nextSteps: normalizeList(progress.next ?? progress.nextSteps ?? metadata.nextSteps ?? metadata.next, [
			"Add project-specific progress notes in `.portfolio/progress.json` inside the source repository.",
		]),
		caseStudy: normalizeCaseStudy(metadata.caseStudy),
		highlights: compactStrings(metadata.highlights, 5),
		learned: compactStrings(metadata.learned, 5),
		related: Array.isArray(metadata.related) && metadata.related.length > 0
			? [...new Set(metadata.related.map((value) => slugify(String(value))).filter(Boolean))].slice(0, 6)
			: undefined,
		featured: metadata.featured === true,
		order: Number.isFinite(Number(metadata.order)) ? Number(metadata.order) : 9999,
		category: cleanText(metadata.category),
		demoUrl: cleanText(metadata.demoUrl),
		started: cleanText(metadata.started),
		shipped: cleanText(metadata.shipped),
		ogImage: cleanText(metadata.ogImage), // override; renderer falls back to github.socialImage
		repositoryUrl: repo.html_url,
		homepageUrl: repo.homepage || undefined,
		github: {
			name: repo.name,
			fullName: repo.full_name,
			defaultBranch: repo.default_branch,
			language,
			languages: languagesUsed,
			topics,
			sizeKb: repo.size,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			updatedAt: repo.updated_at,
			pushedAt: repo.pushed_at,
			private: repo.private,
			archived: repo.archived,
			license: licenseFrom(repo), // free, from the repo list payload
			openIssues: repo.open_issues_count, // NOTE: GitHub counts PRs as issues
			socialImage: socialImageFor(repo), // free, always resolves
			latestRelease: undefined, // set in main() from fetchLatestRelease
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
		if (Boolean(a.featured) !== Boolean(b.featured)) {
			return a.featured ? -1 : 1; // featured first
		}

		const orderA = Number.isFinite(a.order) ? a.order : 9999;
		const orderB = Number.isFinite(b.order) ? b.order : 9999;
		if (orderA !== orderB) {
			return orderA - orderB; // manual order asc
		}

		const starDiff = Number(b.github?.stars || 0) - Number(a.github?.stars || 0);
		return starDiff || a.title.localeCompare(b.title); // existing tiebreak
	});

	const contents = [
		"// This file is generated by scripts/sync-github-projects.mjs.",
		"// Do not edit it by hand. Done items come from recent GitHub commits; edit repo topics, `.portfolio/project.json`, or `.portfolio/progress.json` for the rest.",
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
			let progress = null;

			try {
				metadata = await fetchProjectMetadata(repo);
			} catch (error) {
				console.warn(
					`Skipping metadata for ${repo.full_name}: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}

			try {
				progress = await fetchProgressMetadata(repo);
			} catch (error) {
				console.warn(
					`Skipping progress metadata for ${repo.full_name}: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}

			if (!shouldInclude(repo, metadata)) {
				continue;
			}

			const languages = await fetchLanguages(repo);
			const commits = await fetchCommits(repo);
			const latestRelease = await fetchLatestRelease(repo);

			const project = normalizeProject(repo, metadata || {}, progress || {}, languages, commits);
			if (latestRelease) {
				project.github.latestRelease = latestRelease;
			}

			projects.push(project);
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
