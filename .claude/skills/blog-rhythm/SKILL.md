---
name: blog-rhythm
description: >
  Numeric rhythm gate for rotemhorovitz.com drafts. Puts measurements on the one
  thing the unslop skill asks for qualitatively — "vary rhythm" — by scoring
  sentence-length variance, short- and long-sentence rate, and paragraph shape
  against the published corpus. Runs AFTER unslop, never instead of it. Use
  when the user says "check the rhythm", "does this still read flat", or as the
  last gate before delivering a draft.
user-invokable: true
argument-hint: "<path-to-draft>"
license: MIT
---

# Blog Rhythm

**This skill does not remove AI patterns. `unslop` does that.**

`unslop` is the authority on constructions, vocabulary, punctuation, and voice
— all 31 patterns, plus the "adding soul" section. It is never overridden here.
Run it first, always.

What `unslop` asks for qualitatively is rhythm: *"Short sentences. Then longer
ones that take their time. Mix it up."* That instruction is correct and it is
also unmeasurable by reading — a draft can follow it in spirit and still
cluster around the mean, which is the most reliable AI tell there is. This
skill puts a number on it.

**Order: draft → `unslop` → `blog-rhythm` → deliver.**

If the rhythm gate fails after unslop has run, the fix is a rewrite of the
flagged paragraphs, not another unslop pass.

## Scope boundary

This skill measures **only** sentence and paragraph shape, plus two
voice-density signals unslop doesn't govern (contractions, you:I ratio).

It deliberately does **not** measure or advise on em dashes, bold, italics,
colons, quotes, or heading case. Those are governed by `unslop` rules 13–19 and
this skill must not contradict them.

## The baseline

Measured 2026-08-27 from PR #27 — the eleven posts after the unslop rewrite.
Prose only: frontmatter, code fences, mermaid, headings, tables and blockquotes
excluded. 8,898 words, 679 sentences, 252 paragraphs.

| Metric | Corpus | Pre-rewrite | AI default |
|---|---|---|---|
| Median sentence | **11 words** | 13 | 18-22 |
| Sentence stdev | **8.0** | 9.5 | 2-5 |
| Sentences <=7 words | **28.3%** | 25.9% | under 10% |
| Median paragraph | **3 sentences** | 2 | 3-4 |
| One-sentence paragraphs | **19.4%** | 23.7% | under 5% |
| Contractions | **25.3 / 1k** | 27.0 | 8-15 |
| "you" : "I" | **4.8 : 1** | 5.0 | 1:1 or inverted |

### What the rewrite changed, and why it matters here

Sentences got shorter (median 13 to 11) and the short-sentence rate went up
(25.9% to 28.3%). Both are `unslop` working as intended.

But **stdev fell, 9.5 to 8.0**, and the long-sentence rate more than halved,
8.5% to 3.7%. That is `unslop` rule 28: *"Shorten or split dense sentences. One
idea per sentence."* It systematically removes the 30-plus-word sentences that
used to supply the top half of the variance.

**So the old `>=30 words` gate has been removed.** Gating on long-sentence rate
would pull drafts directly against rule 28, which is exactly the conflict this
skill must not create. It is still printed, as information only. Variance now
comes from the short end, and `<=7 words` carries that signal.

Every threshold below sits at roughly 80% of the corpus minimum, which keeps
real posts clear of the gate while leaving a wide margin to generated prose.

## Pass 1 — measure the rhythm

Run this on the draft body. Same exclusions as the baseline.

```bash
python3 - "$DRAFT" <<'PY'
import re,sys,statistics as st
t=open(sys.argv[1],encoding='utf-8').read()
t=re.sub(r'^---.*?^---','',t,flags=re.S|re.M)
t=re.sub(r'```.*?```','',t,flags=re.S)
t=re.sub(r'^\s*[#>|].*$','',t,flags=re.M); t=re.sub(r'^\s*---\s*$','',t,flags=re.M)
S=[];P=[]
for p in [re.sub(r'\s+',' ',x.strip()) for x in t.split('\n\n') if len(x.strip())>40]:
    s=[y for y in re.split(r'(?<=[.!?])\s+(?=[A-Z"\'*`])',p) if len(y.split())>1]
    S+=[len(y.split()) for y in s]; P.append(len(s))
w=len(t.split()); pct=lambda n:n/len(S)*100; fails=[]
def chk(name,val,fmt,bad,tgt,weight=1):
    fails.append(weight if bad else 0)
    print(f"  {name:<17}{val:{fmt}}   target {tgt:<10}{'FAIL' if bad else 'ok'}")
sd=st.pstdev(S); short=pct(sum(1 for x in S if x<=7))
print(f"{sys.argv[1]}  ({w} words, {len(S)} sentences, {len(P)} paragraphs)")
chk("median sentence",st.median(S),".0f",st.median(S)>16,"<=16")
chk("stdev",sd,".1f",sd<5.5,">=5.5", 2 if sd<4 else 1)
chk("<=7 words",short,".1f",short<14,">=14%", 2 if short<8 else 1)
chk("median para",st.median(P),".0f",st.median(P)>=4,"<=3")
op=sum(1 for x in P if x==1)/len(P)*100
chk("1-sentence para",op,".1f",op<8 and len(S)>=40,">=8%")
print(f"  {'>=30 words':<17}{pct(sum(1 for x in S if x>=30)):.1f}%   informational only")
n=len(re.findall(r"\b\w+'(s|t|re|ll|ve|d|m)\b",t)); print(f"  {'contractions':<17}{n/w*1000:.1f}/1k   target ~25")
print(f"  => score {sum(fails)}")
if len(S)<40: print("  (under 40 sentences - percentile gates noisy, weight stdev most)")
PY
```

**Reading the output.** Thresholds calibrated by running this over all eleven
published posts and over deliberately AI-shaped prose:

| Score | Meaning |
|---|---|
| **0** | Fine. All ten unslopped posts land here. |
| **1-2** | Look closely, especially if stdev or `<=7 words` is the failing gate. |
| **3+** | Rewrite the flagged paragraphs. Synthetic AI prose scores 4; no unslopped post scores above 0. |

Validated 2026-08-27 against all eleven posts plus a synthetic control. The one
post scoring 1 is `pretext-benchmark.mdx`, which the rewrite skipped. The gate
found that on its own, which is the behaviour you want from it.

**Weight stdev and `<=7 words` above the rest.** They separate cleanly: the
worst unslopped post measures 6.8 stdev and 17.4% short sentences, synthetic
prose measures 2.1 and 0%. Each counts double past a second threshold (stdev
under 4, short-sentence rate under 8%), and either alone at that level is close
to conclusive.

Ignore a lone `1-sentence para` fail on a short or reference-style piece.

**Fixing low stdev is not "vary sentence length."** It's finding the paragraphs
where every sentence is doing equal work and cutting one of them down to its
core clause. The short sentences in his writing land a point the long sentence
just built:

> The difference isn't the tool. It's how they're talking to it.

> The names differ. The bones are mostly the same.

> That ends now.

Add those where an argument closes, not at random intervals.

## Re-deriving the baseline

The table above was measured from the posts as published on 2026-08-26. **When
the archive changes materially — posts rewritten, or four or five new ones
added — re-derive it.** A baseline drawn from prose Rotem has since disowned
will gate new drafts toward the old voice.

```bash
python3 - <<'PY'
import re,glob,statistics as st
files=sorted(glob.glob('apps/rotem-is-a-dev/src/app/content/posts/**/*.md',recursive=True)
            +glob.glob('apps/rotem-is-a-dev/src/app/content/posts/**/*.mdx',recursive=True))
S=[];P=[];body=""
for f in files:
    t=open(f,encoding='utf-8').read()
    t=re.sub(r'^---.*?^---','',t,flags=re.S|re.M); t=re.sub(r'```.*?```','',t,flags=re.S)
    t=re.sub(r'^\s*[#>|].*$','',t,flags=re.M); t=re.sub(r'^\s*---\s*$','',t,flags=re.M)
    body+="\n"+t
    for p in [re.sub(r'\s+',' ',x.strip()) for x in t.split('\n\n') if len(x.strip())>40]:
        s=[y for y in re.split(r'(?<=[.!?])\s+(?=[A-Z"\'*`])',p) if len(y.split())>1]
        S+=[len(y.split()) for y in s]; P.append(len(s))
w=len(body.split())
print(f"{len(files)} posts · {w:,} words · {len(S)} sentences")
print(f"median sentence   {st.median(S):.0f}")
print(f"stdev             {st.pstdev(S):.1f}   <- gate at ~80% of this")
print(f"<=7 words         {sum(1 for x in S if x<=7)/len(S)*100:.1f}%   <- gate at ~70%")
print(f">=30 words        {sum(1 for x in S if x>=30)/len(S)*100:.1f}%   <- gate at ~50%")
print(f"median paragraph  {st.median(P):.0f}")
print(f"1-sentence para   {sum(1 for x in P if x==1)/len(P)*100:.1f}%   <- gate at ~50%")
print(f"{'contractions':<18}{len(re.findall(chr(92)+"b"+chr(92)+"w+'(s|t|re|ll|ve|d|m)"+chr(92)+"b",body))/w*1000:.1f}/1k")
PY
```

Run it from the repo root. Then **re-validate the thresholds** the same way they
were set originally: run the Pass 1 gate over every published post and over a
few paragraphs of deliberately generic AI prose. Published posts should score
0–2, generic prose 3+. If a published post scores 3, the gate is too tight —
loosen it rather than "fixing" writing Rotem is happy with.

Update both this file's baseline table and the rhythm table in
`.claude/blog/VOICE.md` together. They must not disagree.

## Constructions — not this skill's job

`unslop` owns every construction, phrase, vocabulary, and punctuation rule. Do
not duplicate its list here and do not second-guess it. If a draft still reads
as AI after unslop and the rhythm gate passes, the problem is structural: the
piece is explaining where it should be arguing, and no line-level pass fixes
that.

The one construction check worth repeating, because it is about placement
rather than wording, is the opening.

## Pass 2 — read the opening

The first two sentences carry the whole thing. Against the published openings:

> "I'll be honest — when I first saw pretext making the rounds, my reaction was
> skepticism."

> "There's a gap between 'I installed the agent' and 'the agent is actually
> useful.' Most people fall into it."

> "TypeScript 4.9 quietly slipped a new operator into our lives — `satisfies` —
> and it solves one of those problems that's just annoying enough to complain
> about but not quite annoying enough to file an issue over."

Every one puts the reader somewhere concrete in sentence one, then complicates
it in sentence two. If the draft opens by *announcing its subject*, rewrite it.
No rhetorical question. No definition. No "In this post we'll".

## Output

Report the measured table, what you cut, and — if anything still fails after
the fixes — say so plainly rather than declaring it clean. A draft that fails
stdev after two rewrites usually has a structural problem: it's explaining
rather than arguing, and no amount of sentence surgery fixes that. Say that
instead of shipping it.
