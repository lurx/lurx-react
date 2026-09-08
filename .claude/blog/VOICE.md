# VOICE.md

How Rotem writes.

**Precedence, highest first:**

1. **`unslop`**, the authority on constructions, vocabulary, punctuation, and
   voice. All 31 patterns. Nothing in this file overrides it.
2. **`## Learned rules`** at the bottom of this file. Rules Rotem added by
   hand or through review feedback.
3. **Everything else here.** Observations derived from the archive.

Derived 2026-08-27 from the eleven posts as rewritten in PR #27, after
`unslop` was applied to the archive. Quoted examples are lifted from those
posts.

---

## The register

Conversational and technically precise at once. Talks *to* the reader, not at
them. Confident enough to give a verdict, honest enough to say where the
verdict runs out. The dominant value in the writing is **anti-hype**. The
recurring move is taking something the ecosystem is excited about and asking
whether it actually earns its keep.

First person throughout. "I'll be honest" is close to a signature. So is
naming his own position before making a claim from it ("I'm a frontend engineer
(previously at Payoneer) who's been building with coding agents daily").

## Openings

Cold. No preamble, no definition, no throat-clearing. The first sentence puts
the reader somewhere concrete. The second usually complicates or reverses it.

What the rewritten posts actually do:

- **The specific annoyance** - "TypeScript 4.9 quietly slipped a new operator
  into our lives. `satisfies` solves one of those problems that's annoying
  enough to complain about, but never quite annoying enough to file an issue
  over."
- **The gap** - "There's a gap between 'I installed the agent' and 'the agent
  is actually useful.' Most people fall into it."
- **The scenario** - "You've spent years on forms, dashboards, and CRUD
  screens. Then one day you wonder what it would take to build a game in
  React."
- **The flat denial** - "No rule says how a React function component has to be
  laid out. The linter doesn't care. The bundler doesn't care."

Then, usually within the first three paragraphs, an explicit contract with the
reader: *what follows is that investigation* / *by the end of this piece you'll
know* / *that's what this article is about*. State it once, plainly, and move.

**Never** open with a rhetorical question, a dictionary definition, "In today's
fast-paced world", or "Have you ever wondered".

## Rhythm

Uneven on purpose. Long, clause-heavy sentences that carry a full thought, then
a short one that lands it.

Measured across the rewritten archive (prose only, code and headings excluded:
8,898 words, 679 sentences):

| | |
|---|---|
| Median sentence | 11 words |
| Sentence stdev | 8.0 |
| Sentences <= 7 words | 28.3% |
| Median paragraph | 3 sentences |
| One-sentence paragraphs | 19.4% |

Over a quarter of sentences are seven words or fewer. AI prose clusters around
18-22 with a stdev near 3, and that clustering identifies a draft faster than
any individual phrase. `blog-rhythm` gates on these numbers.

Note that `unslop` rule 28 caps the long end, so variance comes from the short
end. Do not manufacture a 40-word sentence to raise the spread.

> That ends now.

> The difference isn't the tool. It's how they're talking to it.

> The names differ. The bones are mostly the same.

One-line paragraphs are used as beats, not as a default. If every paragraph is
three lines, the rhythm is wrong.

## Humour

Dry, specific, and rationed, roughly one or two per post, always concrete
rather than a general quip:

> it forgets everything it just learned about your data like a golden retriever
> after a loud noise

> I'd have assumed you were describing science fiction or a very optimistic VC
> pitch deck

Never a joke in place of an explanation. Never a joke in the conclusion.

## Mechanics

> **Punctuation and emphasis are governed by the `unslop` skill, not by this
> file.** Rules 13–19 there cover em dashes, colons, bold, curly quotes, and
> heading case. Where this file and `unslop` disagree, `unslop` wins. Never
> reintroduce a habit from the pre-rewrite archive just because it was measured
> here.

Structural conventions, which `unslop` does not govern:

- **`---` horizontal rules** between major sections.
- **Blockquotes** for asides, callouts, and reader-routing notes.
- **No H1 in the body.** `blog-post-header.component.tsx` already renders
  `<h1>{post.title}</h1>`. The six series parts follow this. The four
  standalone posts still open with `# Title` and therefore ship two H1s per
  page, which is a defect, not a convention. Do not copy it.
- **No emoji.** (`unslop` rule 18 agrees.)
- **Second person for instruction, first person for judgement.**

Two density signals, measured per 1,000 words:

- **Contractions, 25/1k.** Consistently conversational. A draft that spells
  out "it is" and "do not" reads wrong immediately.
- **"you" outnumbers "I" nearly 5:1.** Reader-facing, not self-facing. First person
  appears for judgement and experience, not as the default subject, which is
  what `unslop`'s "Use 'I' when it fits" is pointing at.

**Historical note, not an instruction.** The pre-rewrite archive ran 17.5 em
dashes per 1,000 words. After the rewrite it runs 2.2, and every one of those
is in `pretext-benchmark.mdx`, which the rewrite skipped. Curly quotes are at
zero. The old numbers are recorded here only so nobody re-derives them from an
old checkout and mistakes them for a target.

## Code and diagrams

Real, runnable code. Complete enough to paste. No `// ... rest of the
implementation` in the middle of the example that matters. Language tag always
set, since Shiki renders it with `night-owl`.

Mermaid diagrams where a diagram genuinely beats a paragraph: flows,
architecture, before/after. One or two per post. Never decorative.

## Sourcing

Real links to real sources, with the person or project named as the subject of
the sentence rather than parenthetically:

> "[Alex Azimbaev](...) framed it in a way that stuck with me. 2024 was the
> year of prototypes and proof-of-concepts, when everyone experimented and few
> shipped."

Claims about versions, benchmarks, and releases carry a primary source.
First-hand testing is stated as first-hand testing. Attributions are kept to
what the source actually supports.

## Endings

A verdict, a recommendation, or an honest limit. Never a recap.

> Now you can have both. Validate the data, keep the types, go home.
>
> Small word, very satisfying job.

> Predictability is a badly underrated luxury. Every component opens the same
> way, and after a week you stop reading the structure at all and just read the
> logic.

> React rewards restraint. Write JSX you'd be happy to read out loud.

## Length

1,000–1,500 words standalone. Up to ~2,500 for a deep dive or a series part.
`clean-jsx` is 854, the agentic parts run 1,800–2,800.

## The description field

States what the reader gets, concretely. Names the limits as well as the
promise:

> "How TypeScript's `satisfies` keyword validates your data without throwing
> away type inference, when to reach for it, and when a plain annotation is
> still the right call."

> "Close the gap between installing an agent and getting real value from it.
> How to prompt effectively, provide the right context, and stay in control
> without micromanaging."

---

## Learned rules

Rules added from review feedback. Newest at the bottom. Each one is dated and
phrased as an instruction. Delete any that stop being true. This file is meant
to be edited by hand.

<!-- Append here. Format: -->
<!-- - 2026-09-02: Never open a section with a question. -->
- 2026-09-08: LinkedIn copy gets the same voice as the post, not a summary of it. Open on a concrete moment or a reaction ("I opened package.json ready to delete jszip"), keep one dry joke, and end on the opinion rather than the link. A variant that only restates the post's findings is boring and gets rewritten.
