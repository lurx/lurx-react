---
name: blog-pitch
description: >
  Pick candidate topics for the weekly rotemhorovitz.com post. Reads TOPICS.md for
  the areas in play, the published archive for what is already covered and which
  area ran last week, and searches for what actually landed in those areas this
  week. Enforces week-to-week area rotation. Produces 2-3 pitches with an angle
  each. Use from weekly-blog Stage 1, or when the user says "pitch me a topic",
  "what should I write about", "blog ideas".
user-invokable: true
license: MIT
---

# Blog Pitch

Three inputs, one rotation rule, 2–3 pitches out.

## Inputs

**1. The areas** — `.claude/blog/TOPICS.md`. General areas, not article titles.
If it lists specific ideas Rotem parked there, treat those as high priority.

**2. The archive** — every file under
`apps/rotem-is-a-dev/src/app/content/posts/`. For each, read the frontmatter
only (`title`, `date`, `tags`, `series`). Build:

- What is already covered — never pitch a near-duplicate of an existing post.
- **The last 3 posts by `date`, newest first**, with their primary area. This
  drives rotation.
- Natural follow-ups. A post that ended on an open question is a good seed. A
  series with an obvious next part is a good seed.

**3. What's current** — for the two or three areas that pass rotation, search
for what actually happened in the last ~2 weeks. Aim at primary sources:
release notes, RFCs, changelogs, spec status, the repo itself. Skip listicles
and SEO farms. You are looking for something with a real hook: a shipped
feature, a breaking change, a spec that hit Baseline, a tool that got
genuinely interesting.

## The rotation rule

Map each post to exactly one **primary area** from TOPICS.md, using its first
tag as the strongest signal.

> The primary area of this week's post must differ from the previous post's
> primary area. Prefer differing from the previous **two**.

`react` and `nextjs` count as distinct areas but adjacent — avoid stacking them
back to back when there is a third option. `javascript` and `typescript` are
likewise distinct but adjacent.

**The override.** Rotation is breakable for something genuinely important, and
importance means one of these, not "it's interesting":

- A major stable release in a core area (React, TypeScript, Next.js, a
  baseline CSS feature landing).
- A breaking change or deprecation that will bite people who don't know.
- A security issue in something widely used.
- Something the ecosystem is visibly arguing about right now, where a clear
  technical explainer has real reach.

To use the override, say so explicitly in the pitch: which rule it breaks, and
which of the four reasons applies. Never break rotation quietly.

## Output

Deliver as a message, not a file. Compact:

```
This week's pitches — last post was <title> (<area>, <date>), so <area> is on cooldown.

1. <Working title>
   <area> · <one sentence on the angle — what's the actual insight or verdict>
   Why now: <the hook, with the source link>

2. ...

3. ...

Reply with a number, "none" for a fresh set, or name your own topic.
```

Rules for the pitches themselves:

- **Three at most, two is fine.** More is noise.
- Each pitch needs an *angle*, not a subject. "TypeScript 6.0" is a subject.
  "TypeScript 6.0's new inference rules quietly break a pattern half of us
  use in Redux selectors" is an angle.
- No two pitches from the same area.
- Prefer angles where Rotem can say something from his own experience — he
  writes best when he has a verdict, not a summary. A tool he could actually
  try beats a feature he could only describe.
- If TOPICS.md is thin or every area is on cooldown, say so plainly and pitch
  the best you have rather than padding to three.

## Then stop

Do not start drafting. Wait for the reply.
