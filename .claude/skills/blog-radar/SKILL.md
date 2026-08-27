---
name: blog-radar
description: >
  Daily scan of the TOPICS.md areas for things that actually landed in the last
  24 hours, triaged into durable (worth a blog post) vs timely (worth a LinkedIn
  post only) vs nothing. Runs alongside the weekly post without consuming it.
  Stays silent on quiet days. Use from the daily radar task, or when the user
  says "radar", "anything happening", "what's new today", "worth posting about".
user-invokable: true
license: MIT
---

# Blog Radar

Runs every day. Most days it says nothing. Its whole job is making sure a
genuinely important thing doesn't sit unnoticed for six days waiting for Monday.

**It never drafts and it never replaces the weekly post.** It surfaces and
triages. Rotem decides.

## Scope

The areas in `.claude/blog/TOPICS.md`: javascript, typescript, react, css,
canvas, nextjs, agentic-ai, tools.

Look for things **first announced or published in the last 24 hours**. That
recency window is also the dedupe mechanism — an item from three days ago is
out of scope, so it can't resurface. For anything older than that, check
`.claude/blog/RADAR.md` in the repo (written weekly, so up to a week stale) and
skip what's already logged there.

Go to primary sources. Release notes, changelogs, RFC repos, spec status
trackers, the project's own blog. Not aggregators, not newsletters recapping
last week, not SEO farms.

## The bar

Nothing gets surfaced unless it clears one of these. "Interesting" is not a
criterion.

1. **Major stable release** in a core area — React, TypeScript, Next.js, a CSS
   feature reaching Baseline, Node LTS.
2. **Breaking change or deprecation** that will bite people who don't know
   about it.
3. **Security issue** in something widely used in these areas.
4. **Live argument** — the ecosystem is visibly fighting about something right
   now, and a clear technical explainer would land while it's hot.
5. **A tool worth a verdict** — something new enough and interesting enough
   that Rotem trying it and reporting honestly would be worth reading.

Beta and RC releases only clear the bar if they contain a breaking change
people need lead time on. Point releases essentially never clear it.

## The triage

For each item that clears the bar, answer one question:

> **Will this still be worth reading in three months?**

**Yes → BLOG.** Durable. A concept, a pattern, a migration people will hit for
a year, a tool with a real verdict. This becomes a priority candidate for the
next weekly pitch — say so, and say which area it would occupy for rotation.

**No, but people need to know now → LINKEDIN.** Timely and decaying. A version
shipped, a CVE landed, a deprecation date got announced. Real value is in the
speed, not the depth. One post, no blog.

**Both → BLOG NOW + LINKEDIN TEASER.** Rare. The thing is durable *and* the
window is this week. Flag it as a rotation-break candidate — it's the case the
override rule in `blog-pitch` exists for. Say explicitly which rule it breaks.

**Neither → drop it.** Do not surface it. Most things land here.

Be honest about the split. The failure mode is calling everything durable
because a blog post feels like more of an achievement than a LinkedIn post.
Most news is news.

## Output

**Quiet day — nothing cleared the bar.** One line, nothing else:

```
Radar: nothing today.
```

No summary of what you looked at. No "I checked React, TypeScript, and CSS but
found nothing significant." One line.

**Something cleared it.** Three items maximum, most important first:

```
Radar — <n> item(s)

▸ <Headline>
  <area> · <BLOG | LINKEDIN | BLOG NOW + TEASER>
  What: <one sentence, concrete>
  Why it clears the bar: <which of the 5, in a few words>
  Durable? <the three-month answer, one sentence>
  Source: <primary link>

▸ ...

None of this touches Monday's post unless you want it to.
```

That last line stays. It's the reminder that the weekly cadence is independent.

## What happens next

Rotem's call, entirely. He may say nothing, and that's a normal outcome — the
value is awareness, not action.

- **"linkedin it"** → write the LinkedIn post now, using the rules in
  `blog-ship` section 2. Two variants, same as always. No blog post, no PR.
- **"blog it"** → this becomes Monday's topic. If he wants it sooner, run the
  `blog-draft` stage now; the weekly post still happens on its own schedule.
- **"log it"** → note it for `RADAR.md`, which gets appended in the next weekly
  PR. Useful for things that aren't worth a post now but are worth remembering.
- Silence → nothing happens. Do not follow up. Do not re-surface it tomorrow.
