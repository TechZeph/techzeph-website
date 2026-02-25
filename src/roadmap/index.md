---
layout: roadmap.njk
title: TechZeph Roadmap
noindex: true
eleventyExcludeFromCollections: true
---

# TechZeph Growth & Development Roadmap (Execution Edition)

Updated: 2026-02-25

This version converts strategy into a measurable operating plan: what to ship, in what sequence, and what success/failure looks like.

## 1) Strategic Thesis

TechZeph wins by being:

- UK-specific (pricing, compliance, terminology, VAT realities)
- Trade-specific (workflow by business size and job mix)
- AI-specific (automation outcomes, not generic SaaS lists)

The roadmap prioritizes revenue-bearing commercial content first, then authority-building informational content, then scale systems.

## 2) North Star Metrics

Targets are split by near-term milestones and scaled-state goals.

| Area | Metric | Milestone Target | Scaled Target |
|---|---|---:|---:|
| Visibility | Non-brand organic clicks (GSC) | +100% from baseline | +400% from baseline |
| Rankings | Commercial keywords in Top 20 | 20+ | 80+ |
| Content output | Net new quality pages | 20+ | 120+ |
| Conversion | Affiliate click-through rate on commercial pages | >= 8% | >= 12% |
| Monetization | Revenue per 1,000 sessions (RPMS) | baseline +25% | baseline +100% |
| Freshness | Priority pages refreshed on schedule | >= 90% | >= 95% |
| Quality | Posts passing evidence QA on first review | >= 85% | >= 95% |

## 3) Baseline Snapshot

Current repo state:

- 10 published review posts in `src/posts/*.md` (electrician-focused)
- Build/deploy automation is live through GitHub Actions
- Public deploys exclude `/roadmap/`; roadmap remains available in local/private builds
- Baseline analytics (Cloudflare Web Analytics) and GSC are live
- Sitewide canonical + OG + Twitter metadata and JSON-LD baseline support are live
- Privacy and cookies pages are in place with UK-focused copy and update timestamps
- Post freshness metadata (`lastUpdated`, `lastVerified`) is now present across current review posts
- Advanced event instrumentation is intentionally deferred until traffic/revenue thresholds are met

Implication: measurement/compliance foundations are closed; next leverage is content model standardization (schema + computed URL migration + publish-decision governance) before scaling output.

## 4) Phase Plan With Gates

### Phase 0: Measurement + Compliance Closure

Objective: stop publishing blind and remove trust/compliance weakness.

Deliverables:

- ~~Finish Privacy Policy content for UK GDPR expectations~~
- Add "Last updated" and "Last verified" metadata to posts
- ~~Configure baseline analytics (Cloudflare Web Analytics) and GSC~~
- ~~Standardize canonical + OG + Twitter tags sitewide~~
- ~~Add JSON-LD base support (Article/Breadcrumb)~~

Exit criteria:

- Every post has visible update date
- ~~All indexed pages emit canonical and OG metadata~~
- ~~Baseline traffic measurement is live (sessions, pages, referrers)~~

### Advanced Analytics Activation Gate

Objective: only add advanced event analytics after signal and economics justify the extra complexity.

Activation thresholds (meet at least one traffic/revenue trigger, plus event volume trigger):

- Traffic trigger: >= 15,000 sessions/month for 3 consecutive months
- Revenue trigger: >= GBP 500/month affiliate revenue for 2 consecutive months
- Event-volume trigger: >= 200 monetization events/month (affiliate clicks/leads)

When gate is met:

- Implement affiliate outbound click event tracking by placement (`top`, `mid`, `end`, `table`)
- Add advanced analytics instrumentation and conversion views
- Start CTA and placement experiments with sufficient sample size

### Phase 1: Information Architecture + Content Model

Objective: make content structured enough for filtering, automation, and programmatic growth.

Deliverables:

- Implement computed permalink architecture (URL from metadata, not folder structure)
- Generate category landing pages from metadata at `/best-ai-tools-uk/{businessType}/{primaryCategory}/`
- Enforce frontmatter schema for all posts
- Backfill all current posts to the schema
- Add validation script to fail CI when required fields are missing
- Add publish-decision schema (`index`, `noindex`, `canonicalize_to_generic`) to prevent thin duplicate variants
- Maintain redirect map for any legacy URL that changes

Programmatic URL schema (canonical):

- Tool reviews: `/best-ai-tools-uk/{businessType}/{primaryCategory}/{toolSlug}/`
- Top lists: `/best-ai-tools-uk/{businessType}/{primaryCategory}/top-5-{listTopic}/`
- Comparisons: `/best-ai-tools-uk/{comparisonA}-vs-{comparisonB}/`
- All authored content remains in `src/posts/*.md`; URL shape is computed from frontmatter

Frontmatter schema v3:

```yaml
contentType: toolReview # toolReview | topList | comparison
businessType: trades
primaryCategory: electrician
toolName: Jobber
toolSlug: jobber
listTopic: job-management # required for topList
comparisonA: jobber # required for comparison
comparisonB: tradify # required for comparison
seoSlug: jobber-review-uk-electrician # optional override
canonicalMode: self # self | generic
canonicalTarget: /best-ai-tools-uk/trades/general/jobber/ # required if canonicalMode=generic
indexMode: index # index | noindex
currency: GBP
region: uk
lastUpdated: 2026-02-25
lastVerified: 2026-02-25
sources:
  - https://vendor-site.example/pricing
  - https://vendor-site.example/partner-program
```

Publish-decision schema:

- `index`: use when trade-specific page has materially unique workflow, constraints, pricing fit, and verdict
- `canonicalize_to_generic`: use when content substantially overlaps generic tool guidance
- `noindex`: use for draft, thin, or low-confidence variants pending enrichment

Exit criteria:

- 100% of posts pass schema validation in CI
- Taxonomy collisions reduced to zero (single canonical value per concept)
- 100% of new posts follow canonical URL schema by content type
- Legacy URLs resolve via redirects without orphaned traffic

### Phase 2: Conversion Optimization On Existing Traffic

Objective: increase revenue without waiting for traffic growth.

Deliverables:

- Standardize commercial page layout blocks:
  - Quick verdict
  - "Best for / Not ideal for"
  - Pricing summary
  - CTA placements (`above_fold`, `after_pricing`, `end_of_post`)
- Add comparison tables with direct decision fields
- Add stronger internal links from informational pages to money pages
- Implement copy/placement testing cadence (structured iteration cycles)

Exit criteria:

- Affiliate CTR improvement >= 25% from pre-phase baseline
- At least one winning CTA variant documented and rolled out sitewide

### Phase 3: Electrician Topical Authority Domination

Objective: own the electrician cluster before adding new trades.

Deliverables:

- Publish 8-12 new commercial pages:
  - high-intent comparisons
  - alternatives pages
  - "best for X business size" pages
- Publish 6-8 informational support pages linked to commercial pages
- Build a topical map with parent/child internal links and breadcrumbs
- Refresh all existing electrician review pages with verified sources

Exit criteria:

- 25+ electrician pages live
- 80% of electrician money pages pass freshness and evidence checks
- 20+ electrician commercial keywords in Top 20

### Phase 4: AI-Assisted Editorial Pipeline

Objective: scale output while preserving factual integrity.

Deliverables:

- Build content queue (`data/tools.csv` or JSON)
- Add scripted pipeline:
  - research capture from primary sources
  - structured draft JSON generation
  - markdown render from templates
  - QA checks (sources, claims, compliance copy, metadata)
  - PR with checklist for human approval
- Add refresh bot to re-validate price/affiliate claims by priority tier

Exit criteria:

- Draft throughput >= 3 publish-ready pieces per production cycle
- Human review time <= 20 minutes/article
- Factual correction rate after publish <= 2%

### Phase 5: Second Trade Pilot (Plumber)

Objective: prove repeatability before broad vertical expansion.

Deliverables:

- Publish plumber starter cluster:
  - 6 commercial pages
  - 4 informational pages
- Reuse electrician system with trade-specific adjustments
- Compare performance vs electrician benchmark milestones at defined checkpoints

Exit criteria:

- Plumber cluster reaches >= 60% of electrician early-stage velocity
- No major QA degradation versus electrician content

### Phase 6: Programmatic + Product Layer

Objective: compound output through structured data and interactive experiences.

Deliverables:

- Vendor database with normalized attributes
- Programmatic pages for high-intent templates
- "TechZeph Score" rubric with transparent weighting
- Interactive filtering (trade, business size, VAT, integrations, support)
- Begin newsletter + lead magnet only after conversion baseline is healthy

Exit criteria:

- Programmatic pages contribute >= 20% of organic clicks
- Interactive pages outperform static equivalents on engagement and CTR

## 5) Content Prioritization Model

Use a weighted score for backlog ordering:

`Priority Score = (Commercial Intent * 0.30) + (Affiliate Value * 0.25) + (UK Fit * 0.20) + (Ranking Opportunity * 0.15) + (Content Gap * 0.10)`

Scoring bands:

- P0: 80-100 (ship immediately)
- P1: 65-79 (ship in the current execution cycle)
- P2: <65 (defer)

Use `docs/affiliate-link-priority.md` to initialize affiliate value inputs and then refine with real click/revenue data.

## 6) Editorial Quality Gate (Definition Of Done)

A post is publishable only if all checks pass:

- Claim-level evidence present and linked in source metadata
- Pricing and affiliate terms verified as current at publish time
- UK relevance explicit (currency, support region, compliance context)
- Clear "Best for / Not ideal for" statements
- Internal links: minimum 3 relevant links
- CTA present in planned positions
- Metadata complete (title, description, canonical, schema)
- Publish decision set and justified (`index` vs `canonicalize_to_generic` vs `noindex`)
- For trade-specific pages, uniqueness is explicit (workflow differences, pricing-fit differences, trade-specific recommendation logic)

## 7) Execution Sequence (Non-Time-Gated)

### Sequence Block A: Foundation

- ~~Finalize baseline analytics and compliance copy~~
- Add update-date components in templates
- Implement computed permalink engine for `contentType/businessType/primaryCategory`
- Migrate existing posts to canonical URL schema and ship redirect mappings
- Implement frontmatter schema validation in CI
- Backfill legacy posts, publish-decision fields, and remove taxonomy drift

### Sequence Block B: Commercial Expansion

- Publish highest-intent comparison pages
- Publish business-size segment pages
- If Advanced Analytics Activation Gate is met, implement event tracking and CTA testing instrumentation
- Launch CTA placement test cycle and roll out winning variants
- Publish informational bridge posts with internal links

### Sequence Block C: Cluster Consolidation

- Publish alternatives pages
- Publish additional commercial reviews/comparisons
- Run refresh sweep on top money pages
- Run performance review and reprioritize backlog by metric outcomes

Milestone output target for this sequence:

- 12+ new pages (8 commercial, 4 informational)
- 100% legacy review refresh pass

## 8) Governance And Operating Rhythm

Each operating cycle:

- KPI review (traffic, rankings, CTR, RPMS, refresh status)
- Content retro (what converted, what did not)
- Backlog reprioritization by Priority Score

Each planning cycle:

- Full cluster gap analysis
- Update roadmap assumptions and capacity
- Kill low-leverage initiatives explicitly

At major decision checkpoints:

- Decide whether to expand one new trade or deepen current cluster
- Rebalance effort across content, product, and monetization

## 9) Risks And Mitigations

- Risk: AI content quality drift  
  Mitigation: hard QA gate + evidence requirements + human approval PR

- Risk: scaling before conversion works  
  Mitigation: Phase 2 gate must pass before high-volume expansion

- Risk: stale pricing/affiliate claims  
  Mitigation: priority-based refresh SLA and automated reminder workflow

- Risk: diluted niche positioning  
  Mitigation: one-trade-at-a-time expansion rule with performance gate

## 10) What Not To Do Yet

- Do not expand beyond one new trade until electrician cluster gates are met
- Do not run paid acquisition before conversion and tracking are stable
- Do not add heavy product features before data model and taxonomy are clean
- Do not publish AI-generated posts without evidence logs and manual QA

## 11) Core Advantage To Protect

TechZeph edge remains:

**UK-focused + Trade-specific + AI-positioned + Evidence-backed recommendations**

If a roadmap item weakens that combination, deprioritize it.
