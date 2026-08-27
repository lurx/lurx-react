---
name: blog-ship
description: >
  Ship an approved rotemhorovitz.com post — produce the branch/commit/PR command
  block (or open the PR directly when running locally with gh), then write two
  LinkedIn variants with different angles plus the recommended posting slot.
  Use from weekly-blog Stage 4, or when the user says "ship it", "open the PR",
  "linkedin post", "write the linkedin".
user-invokable: true
license: MIT
---

# Blog Ship

Only runs after Rotem has approved the draft. Two outputs: the PR, and the
LinkedIn copy.

## 0. Schema

**There is nothing to generate here per post.** Read this section once, act on
it once, then it becomes a two-second check every week.

The site emits no JSON-LD at all. `generateMetadata` in
`apps/rotem-is-a-dev/src/app/(main)/blog/[slug]/page.tsx` returns only `title`
and `description` — no Open Graph, no canonical, no structured data.

The fix belongs in the template, not in frontmatter. Everything a `BlogPosting`
needs is already on the `post` object Velite hands the page: `title`,
`description`, `date`, `slug`, `tags`, and `metadata` (reading time, word
count). A component that reads those covers all eleven existing posts and every
future one automatically. A per-post JSON-LD blob would duplicate frontmatter,
need a `velite.config.ts` field that does not exist, and leave the archive
uncovered.

So:

- **If the template still has no JSON-LD**, say so once when delivering, and
  offer to do it as its own app-level PR. Do not put it in the content PR and
  do not add a frontmatter field for it.
- **Once the template emits it**, this step is a check, not a generation:
  confirm the new post has the fields the component reads (it will, if the
  frontmatter matched the schema) and move on. Only speak up if the post uses
  something the component does not handle, such as a series post needing
  `isPartOf`, or an MDX post whose hero image is not where the component looks.

While that PR is open, two neighbouring gaps are worth fixing in it, since
they are the same file and the same five minutes:

- `generateMetadata` sets no `alternates.canonical` and no `openGraph`. With
  `metadataBase` now correct, adding them is a few lines.
- The four standalone posts carry an `# H1` in the body while
  `blog-post-header.component.tsx` already renders `<h1>{post.title}</h1>`, so
  those pages ship two H1s.

## 1. The PR

**Cloud session** — you cannot push. Deliver the final file with
`SendUserFile`, then give one copy-paste block. Assume Rotem is at the repo
root with the file already saved to its path:

```bash
git checkout main && git pull && git checkout -b content/<slug>
git add apps/rotem-is-a-dev/src/app/content/posts/<slug>.md .claude/blog/VOICE.md
git commit -m "content(<area>): add <title>"
git push -u origin content/<slug>
gh pr create --title "content(<area>): add <title>" --body "<2-3 line summary>"
```

Include `.claude/blog/VOICE.md` in the `git add` **only if a learned rule was
added this week.** If not, drop it from the line — don't stage a file that
hasn't changed.

**Local session** — you have `git` and `gh`. Run it yourself, then give Rotem
the PR URL. Still create the branch from a fresh `main` (`git checkout main &&
git pull` first), per the repo's own CLAUDE.md.

Conventions, from the repo's history:

- Branch: `content/<slug>` for posts. (`feat/`, `fix/`, `chore/` are for code.)
- Commit: `content(<area>): <what>` — e.g. `content(typescript): add satisfies
  keyword post`. Scope is the primary area.
- PR body: what the post covers, why now, anything you want reviewed. Two or
  three lines.

Nx runs lint and tests on the repo; a content-only PR shouldn't trip either,
but if CI fails on the post, it's usually a lint rule on the MDX or a broken
mermaid fence.

## 2. LinkedIn — two variants

Two genuinely different angles, so there's a real choice. Not one post and a
paraphrase.

Pick two from:

- **The problem** — open on the concrete thing that broke or annoyed, land on
  what he found.
- **The verdict** — open on the conclusion, especially a contrarian one.
  "I went in expecting X. It's not X."
- **The one detail** — the single most surprising fact in the post, told
  properly, with the post as the place to get the rest.
- **The mistake** — something he got wrong, or that most people get wrong.
  These travel furthest and Rotem's honest register suits them.

Rules for both:

- **~120–150 words.** Shorter beats longer.
- **First line is everything** — it's the only part shown before "see more."
  It must work as a standalone sentence and must not be a question that reads
  as bait.
- Same voice as the blog. Read VOICE.md. If it sounds like a LinkedIn
  influencer, it's wrong.
- **No hashtag spam.** Two or three, lowercase, relevant. Or none.
- **No emoji bullets.** No "🚀". No "Here's the thing:" as a paragraph.
- Link at the end: `https://rotemhorovitz.com/blog/<slug>`
- Never open with "I'm excited to share" or "Just published".

Deliver both in the message as plain text ready to paste — not as a file — with
a one-word label for each angle so Rotem can pick fast.

## 3. When to post

Publish the blog on merge, then post to LinkedIn separately.

**Recommendation: post Tuesday or Wednesday.** Every dataset agrees midweek
(Tue–Thu) beats Monday, Friday, and weekends, and that weekends are dead for
professional content. They disagree on time of day — Sprout Social puts the
peak at 11:00–16:00 local for tech audiences, Buffer's larger sample puts it
later, 15:00–20:00. The overlap is **mid-to-late afternoon**.

For Rotem specifically, at UTC+3, the deciding factor is where his audience
actually is:

- **Israel / Europe heavy** → Tuesday or Wednesday, **10:00–12:00** Israel time.
- **US heavy** → **16:00–18:00** Israel time, which is 9:00–11:00 ET and
  catches the US morning while Europe is still active.

That makes the natural weekly rhythm: **Monday** pitch and draft, **Tuesday**
review and merge, **Wednesday morning** LinkedIn.

State the recommended slot when delivering the variants. This is population-
level data, not Rotem's data — after 6–8 posts his own LinkedIn analytics beat
any study, so remind him once around then to check what actually worked and
adjust this section.

Sources: [Sprout Social](https://sproutsocial.com/insights/best-times-to-post-on-linkedin/) · [Buffer, 4.8M posts](https://buffer.com/resources/best-time-to-post-on-linkedin/)
