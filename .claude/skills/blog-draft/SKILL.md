---
name: blog-draft
description: >
  Write the weekly rotemhorovitz.com post — correct Velite frontmatter, correct
  file path, Rotem's voice from VOICE.md, sourced claims, then an unslop pass
  before delivery. Handles md vs mdx, series posts, mermaid diagrams, shiki code
  fences, and snippet includes. Use from weekly-blog Stage 2, or when the user
  says "draft the post", "write it up", "write the blog post".
user-invokable: true
argument-hint: "<approved topic>"
license: MIT
---

# Blog Draft

## Before you write a single line

1. **Read `apps/rotem-is-a-dev/velite.config.ts`.** The `posts` and `mdxPosts`
   collections define the frontmatter contract. It changes. The fields listed
   below are what it looked like when this skill was written — if the config
   disagrees with this file, **the config wins** and you should mention the
   drift in your delivery message.
2. **Read `.claude/blog/VOICE.md` in full**, including `## Learned rules` at
   the bottom. Those are rules Rotem added by hand or through review feedback.
   They outrank the general guidance here.
3. **Read the two most recent posts** by date. Voice drifts; the recent ones
   are the current truth.
4. **Do the research.** Every load-bearing claim needs a primary source you
   have actually fetched. Release notes, RFCs, specs, the repo. If you tested
   something yourself, say so explicitly — that is Rotem's strongest material.

## Frontmatter

Schema as of writing (`s.object` in `velite.config.ts`):

```yaml
---
title: "The title, in quotes. Backticks and colons are fine inside"
slug: short-stable-slug
date: 2026-09-02
description: "One or two sentences. A teaser, not a summary. First person is fine and often better."
tags: [primary-area, secondary, tertiary]
draft: false
---
```

- `title` — required. Quote it always. Rotem's titles often carry a parenthetical
  or a subtitle after a colon.
- `slug` — required, unique across posts, kebab-case, short. Not the filename.
  Series posts use `<series>-<n>-<short>`, e.g. `agentic-ai-1-the-new-stack`.
- `date` — required, `YYYY-MM-DD`. Set it to the **intended publish date**
  (the Wednesday), not today.
- `description` — required. This is the card and meta description. Write it
  like a hook, not a table of contents.
- `tags` — required array. **First tag is the primary area** and is what the
  rotation rule reads next week. Use existing tags where they exist —
  `react`, `typescript`, `javascript`, `css`, `performance`, `ai`,
  `agentic-development`, `architecture`, `best-practices` — check the archive
  before inventing a new one. Three to four tags.
- `draft` — `false` for a post meant to publish on merge. Use `true` only if
  Rotem says he wants it to land unpublished.
- `series` + `seriesOrder` — only for series posts. Both or neither.
- `component` — **only** for `.mdx` posts with an interactive React component.
  The component must already exist in the app. Do not invent one.

## File path and format

```
apps/rotem-is-a-dev/src/app/content/posts/<slug>.md
apps/rotem-is-a-dev/src/app/content/posts/<series-dir>/part-<n>-<short>.md
```

**`.md` by default.** Use `.mdx` only when the post genuinely needs an
interactive component — a live benchmark, a playable demo. An MDX post is a
much bigger job because the component has to be built and tested; if you think
a post wants one, say so at pitch time, not mid-draft.

## Available in content

- **Code fences** with a language tag. Shiki, `night-owl` theme. Use real,
  runnable code — no `// ...` hand-waving in the middle of a key example.
- **Mermaid** via ```mermaid fences. Good for flows and architecture, and Rotem
  uses them in recent posts. One or two per post, only where a diagram beats a
  paragraph. Not decoration.
- **Snippet includes** from `apps/rotem-is-a-dev/src/snippets/` via the
  `remarkIncludeSnippet` plugin — check `src/app/content/plugins/` for the exact
  syntax before using one.
- **External links** get rehype-processed automatically. Just write normal
  markdown links.

## Structure

- **No H1 in the body.** `blog-post-header.component.tsx` renders
  `<h1>{post.title}</h1>` already. The six series parts follow this correctly.
  The four standalone posts still open with `# Title` and ship two H1s per
  page. That is a defect, not a convention. Do not copy it.
- Open cold — see VOICE.md. No preamble, no "in this article we will".
- `---` horizontal rules between major sections. Rotem uses these consistently.
- `##` for sections, `###` for subsections. Descriptive, not clever-for-its-
  own-sake, though a little wit in a heading is on-brand.
- Blockquotes for asides and callouts.
- Close with a real conclusion — a verdict, a recommendation, or an honest
  "here's what I still don't know." Never a summary of what was just said.
- **Length: 1,000–1,500 words** for a standalone post. Up to ~2,500 for a deep
  dive or a series part. Do not pad to hit a number; do not sprawl.

## Charts

If the post has data — benchmark numbers, a before/after, a comparison across
versions — use **`blog-chart`** to generate the SVG rather than describing the
numbers in prose or dropping in a table.

It produces inline SVG that is dark-mode-safe with transparent backgrounds and
accessible markup (`role="img"`, `aria-labelledby`), which matters here: the
site renders `night-owl` and a chart with a baked white background will look
broken. It also enforces chart-type variety, so a post with three charts won't
be three bar charts.

Mermaid is still the right tool for **flows and architecture**. `blog-chart` is
for **quantities**. Don't reach for a chart when there are three numbers — say
the three numbers.

## Fact-check pass

Before the unslop pass, run **`blog-factcheck`** on the draft.

It extracts every load-bearing claim, fetches the cited URL, and checks the
claim actually appears on the page — scoring exact match, paraphrase, or not
found, and flagging uncited claims as UNVERIFIED.

This is the single highest-value borrowed skill for technical writing, because
the failure it catches is the one that costs credibility: a confidently stated
version number, benchmark figure, or "X deprecated Y in version Z" that is
subtly wrong.

**Anything that comes back not-found or UNVERIFIED gets fixed before delivery** —
find a real source, soften the claim to what the source supports, or cut it.
Do not deliver a draft with a known-unverified claim in it and a note saying so.
Fix it first. Only surface it to Rotem if you genuinely cannot resolve it.

## The unslop pass

Run the **`unslop`** skill on the draft. It ships in the repo at
`.claude/skills/unslop/` and is available in every session, cloud included. It
is the authority on constructions, vocabulary, punctuation, and voice — all 31
patterns plus the "adding soul" section. Follow it exactly; do not substitute
judgement for its rules.

Note especially that it **bans em dashes outright** (rule 13) and does not
accept parentheses as a substitute, uses sentence case for headings (17), and
straight quotes (19). The pre-rewrite archive violates all three, so do not
pattern-match punctuation off older posts.

Then run **`blog-rhythm`**. It measures what unslop asks for qualitatively —
"vary rhythm" — against the corpus: sentence-length variance, short- and
long-sentence rate, paragraph shape. It adds no rules of its own and never
contradicts unslop.

**Order: draft → unslop → blog-rhythm → deliver.** A score of 3+ from the
rhythm gate means rewrite the flagged paragraphs, not run unslop again. Do not
deliver through a failing gate with a note about it.

Then read the opening two sentences. If they announce the subject, rewrite
them. If they put the reader somewhere concrete and then complicate it, keep
them.

## Deliver

Write the file to its real path in the clone, then deliver it with
`SendUserFile` so it renders in the conversation. One or two sentences with it,
no more:

- The path and filename.
- Word count.
- **Anything you were unsure about** — a claim you couldn't fully source, a
  section you think is weak, a place you made a judgement call. Say it plainly.
  Do not present a draft as finished when you know where the soft spot is.

Then stop and wait for review.
