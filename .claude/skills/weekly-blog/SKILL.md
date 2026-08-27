---
name: weekly-blog
description: >
  Run the weekly blog pipeline for rotemhorovitz.com — pitch a topic, draft the
  post in Rotem's voice against the Velite schema, review and revise, then
  produce the PR command block and two LinkedIn variants. Routes to blog-pitch,
  blog-draft, and blog-ship. Use when the user says "weekly blog", "blog pitch",
  "this week's post", "write the post", "blog it", or when a Monday blog task
  fires.
user-invokable: true
argument-hint: "[pitch|draft|ship] [topic]"
license: MIT
---

# Weekly Blog

The pipeline that takes rotemhorovitz.com from "it's Monday" to "PR open, LinkedIn
copy in hand." Four stages, two of which are hard stops that wait for Rotem.

Running alongside it, on its own daily schedule, is **`blog-radar`** — a daily
scan that surfaces genuinely important items and triages them into blog-worthy
vs LinkedIn-only. It is independent: a radar hit never consumes or replaces the
weekly post, and a quiet radar day never delays it.

## Borrowed skills

Four skills from outside this plugin do specific jobs in the pipeline. If one
isn't installed, carry on without it and say so once in the delivery message —
never silently skip a verification step.

| Skill | Stage | Job |
|---|---|---|
| `blog-factcheck` | 2 | Fetch every cited URL, verify the claim is actually on the page |
| `unslop` | 2 | **The** AI-tell pass — 31 patterns. Ships in the repo, available everywhere. Authoritative on punctuation and voice |
| `blog-chart` | 2 | Dark-mode-safe accessible SVG for benchmark and comparison data |
| `blog-schema` | 4 | JSON-LD for the post — the site currently emits none |
| `blog-style` | maintenance | Re-derive VOICE.md from the archive |

`blog-rhythm` ships inside this plugin. It measures rhythm only and defers to
`unslop` on everything else — the two must never be treated as alternatives.

## Constants

| Thing | Value |
|---|---|
| Repo | `https://github.com/lurx/lurx-react` (public) |
| Site | `https://rotemhorovitz.com` |
| Posts | `apps/rotem-is-a-dev/src/app/content/posts/` |
| Schema | `apps/rotem-is-a-dev/velite.config.ts` — **read it, never assume** |
| Voice | `.claude/blog/VOICE.md` |
| Topics | `.claude/blog/TOPICS.md` |

## Where you are running

**Cloud session (the Monday task, or Cowork):** you have no local checkout.
Clone read-only into a temp dir and work from there:

```bash
git clone --depth 50 https://github.com/lurx/lurx-react.git /tmp/lurx-react
```

You cannot open the PR from here. Stage 4 hands Rotem a command block instead.

**Local session (Claude Code inside the repo):** you already have the repo,
`git`, and `gh`. You can open the PR yourself.

Detect which by checking for `velite.config.ts` under `apps/rotem-is-a-dev/`
relative to the working directory. Do not ask Rotem which one he is in.

## The pipeline

### Stage 1 — Pitch → `blog-pitch`

Produce 2–3 candidates with a one-line angle each, then **stop and wait**.

Rotem's replies and what they mean:

- Picks one → go to Stage 2.
- Rejects all → re-pitch, different areas, do not repeat a rejected angle.
- Names his own topic → skip straight to Stage 2 with it. Still apply the
  rotation check and say so if it collides, but his choice wins.

### Stage 2 — Draft → `blog-draft`

Write the post, run the unslop pass, deliver the file. **Stop and wait.**

### Stage 3 — Review loop

Rotem responds with feedback or approval.

Feedback that is about **this post's content** (wrong claim, missing case, cut
that section) → just fix it and re-deliver.

Feedback that is about **style or voice** ("make it funnier", "less hedging",
"stop opening with a question", "shorter paragraphs") → apply it, then ask
exactly once, in one line:

> Rule for always, or just this once?

- **always** → append it to `.claude/blog/VOICE.md` under `## Learned rules`
  as a dated bullet, phrased as an instruction. It ships in the same PR as the
  post. Confirm in one line: `Added to VOICE.md: <rule>`
- **just this once** → apply to this draft only, record nothing.

Never ask this twice for the same piece of feedback. Never ask it for content
feedback. If Rotem's wording already settles it ("from now on, always...",
"just for this one"), skip the question and act.

Loop until he approves.

### Stage 4 — Ship → `blog-ship`

Schema, PR command block, then the two LinkedIn variants.

## Maintenance

**`weekly-blog voice refresh`** — run `blog-style` across the published archive
to re-derive the measurable half of the voice profile (sentence-length
distribution, paragraph rhythm, vocabulary tier, contraction frequency) and
reconcile it against `.claude/blog/VOICE.md`.

Worth doing every couple of months, or whenever a draft keeps missing. Report
the drift and propose edits — **never overwrite VOICE.md automatically.**
`## Learned rules` is Rotem's, and a generated profile must not clobber a rule
he added on purpose.

## Rules that hold across every stage

1. **Read `velite.config.ts` before writing frontmatter.** The schema is the
   source of truth and it changes. Never write frontmatter from memory or from
   the examples in `blog-draft`.
2. **Never push, commit, or open a PR without approval at Stage 3.** Even
   locally. The draft PR is created in Stage 4, not before.
3. **Never edit an existing published post** unless Rotem asks. New post, new
   file.
4. **One post per run.** If a topic is clearly a series, pitch it as a series
   and write part 1 only.
5. **Facts get sources.** Version numbers, benchmark claims, release dates,
   "X is faster than Y" — link the primary source (release notes, RFC, spec,
   the repo itself). No source, no claim. If a claim is load-bearing and you
   cannot source it, cut it or mark it as your own testing and say so.
6. Stay inside `/tmp/lurx-react` and this session's scratch dir when cloud-side.
   Never write into a real checkout you did not clone.
