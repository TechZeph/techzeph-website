import { projects, type Project } from "./projects";
import taxonomy from "./topics.taxonomy.json";

/**
 * Topic taxonomy + aggregation for the portfolio.
 *
 * The CANONICAL vocabulary (slug normalization rules, aliases, group labels,
 * and per-topic display/SEO copy) lives in ONE shared file: topics.taxonomy.json.
 * That same file is read by scripts/derive-topics.mjs (which DETECTS topics from a
 * repo) so detection and these landing pages can never drift.
 *
 * This module:
 *   1. re-implements slugify/titleize exactly as scripts/sync-github-projects.mjs
 *      does (so derived slugs line up with the generated data), and
 *   2. derives the UNION of every project's tags + skills + github.topics, mapping
 *      each value through the shared alias map to a single canonical slug, then
 *   3. merges the hand-authored registry (topics.taxonomy.json -> topics) with an
 *      auto-titleize fallback, and exposes getAllTopics() / getTopic(slug) for
 *      getStaticPaths.
 */

type TopicSource = "tag" | "skill" | "github-topic";

type TopicKind = "language" | "framework" | "infra" | "domain" | "practice" | "meta";

interface TaxonomyRegistryEntry {
	title?: string;
	kind?: TopicKind;
	detectable?: boolean;
	description?: string;
	seo?: string;
	group?: string;
	hidden?: boolean;
	minProjects?: number;
}

interface TaxonomyFile {
	version: number;
	config?: { minProjects?: number; defaultGroup?: string };
	groups?: Record<string, string>;
	aliases?: Record<string, string>;
	topics?: Record<string, TaxonomyRegistryEntry>;
}

const taxonomyData = taxonomy as TaxonomyFile;

const topicRegistry: Record<string, TaxonomyRegistryEntry> = taxonomyData.topics ?? {};
const topicAliases: Record<string, string> = taxonomyData.aliases ?? {};
const groupLabels: Record<string, string> = taxonomyData.groups ?? {};
const GLOBAL_MIN_PROJECTS = taxonomyData.config?.minProjects ?? 1;
const DEFAULT_GROUP = taxonomyData.config?.defaultGroup ?? "other";

/** Mirrors slugify() in scripts/sync-github-projects.mjs. */
export function slugifyTopic(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Mirrors titleize() in scripts/sync-github-projects.mjs. */
export function titleizeTopic(value: string): string {
	return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/** Collapse a raw label to its canonical topic slug via the shared alias map. */
export function canonicalTopicSlug(raw: string): string {
	const slug = slugifyTopic(raw);
	return topicAliases[slug] ?? slug;
}

/** Human label for a group key (falls back to a titleized key). */
export function groupLabel(group: string): string {
	return groupLabels[group] ?? titleizeTopic(group);
}

export interface Topic {
	slug: string;
	title: string;
	description: string;
	seo: string;
	kind: TopicKind | "other";
	group: string;
	groupLabel: string;
	count: number;
	projects: readonly Project[];
	/** Which source arrays contributed this slug (for optional badging). */
	sources: readonly TopicSource[];
}

function rawLabelsFor(project: Project): { value: string; source: TopicSource }[] {
	return [
		...project.tags.map((value) => ({ value, source: "tag" as const })),
		...(project.skills ?? []).map((value) => ({ value, source: "skill" as const })),
		...(project.github?.topics ?? []).map((value) => ({ value, source: "github-topic" as const })),
	];
}

function buildTopics(): Topic[] {
	const map = new Map<string, { projects: Set<Project>; sources: Set<TopicSource> }>();

	for (const project of projects) {
		// Dedupe slugs within a single project so count is per-project, not per-mention.
		const seen = new Map<string, Set<TopicSource>>();

		for (const { value, source } of rawLabelsFor(project)) {
			const slug = canonicalTopicSlug(value);

			if (!slug) {
				continue;
			}

			if (!seen.has(slug)) {
				seen.set(slug, new Set());
			}

			seen.get(slug)!.add(source);
		}

		for (const [slug, sources] of seen) {
			if (!map.has(slug)) {
				map.set(slug, { projects: new Set(), sources: new Set() });
			}

			const entry = map.get(slug)!;
			entry.projects.add(project);

			for (const source of sources) {
				entry.sources.add(source);
			}
		}
	}

	const topics: Topic[] = [];

	for (const [slug, { projects: projectSet, sources }] of map) {
		const registry = topicRegistry[slug] ?? {};

		if (registry.hidden) {
			continue;
		}

		// Preserve the projects.ts ranking order (techzeph-website pin, then stars/title).
		const projectList = projects.filter((project) => projectSet.has(project));
		const minProjects = registry.minProjects ?? GLOBAL_MIN_PROJECTS;

		if (projectList.length < minProjects) {
			continue;
		}

		const title = registry.title ?? titleizeTopic(slug);
		const description =
			registry.description ??
			`${projectList.length} TechZeph project${projectList.length === 1 ? "" : "s"} tagged ${title}.`;
		const group = registry.group ?? DEFAULT_GROUP;

		topics.push({
			slug,
			title,
			description,
			seo: registry.seo ?? description,
			kind: registry.kind ?? "other",
			group,
			groupLabel: groupLabel(group),
			count: projectList.length,
			projects: projectList,
			sources: [...sources],
		});
	}

	// Directory order: most-covered first, then alphabetical by title.
	return topics.sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
}

const allTopics = buildTopics();

export function getAllTopics(): readonly Topic[] {
	return allTopics;
}

export function getTopic(slug: string): Topic | undefined {
	return allTopics.find((topic) => topic.slug === slug);
}

/** Topics that co-occur with the given topic on at least one shared project. */
export function getRelatedTopics(topic: Topic, limit = 8): readonly Topic[] {
	return allTopics
		.filter(
			(other) =>
				other.slug !== topic.slug &&
				other.projects.some((project) => topic.projects.includes(project)),
		)
		.slice(0, limit);
}
