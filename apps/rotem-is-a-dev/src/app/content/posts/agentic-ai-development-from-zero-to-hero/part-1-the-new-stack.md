---
title: "The New Stack: Understanding Gen AI, LLMs, and Why They Matter"
slug: agentic-ai-1-the-new-stack
date: 2026-03-31
description: "Before we talk about agents, workflows, and team structure, let's make sure we're speaking the same language. A practical introduction to generative AI, LLMs, and why this moment matters."
tags: [ai, agentic-development, llm]
draft: true
---

A couple of years ago, if you'd told me I'd be having a conversation with my code editor — not typing into it, but *talking to it* — I'd have assumed you were describing science fiction or a very optimistic VC pitch deck. I'd watch it reason through a problem, push a fix, run the tests, and come back with a summary. But here we are. The tools exist, the workflows are real, and teams are already shipping with them. The question is no longer *"will AI change how we build software?"* — that ship has sailed. The question is *"do you understand it well enough to use it well?"* That's what this series is about.

There's a framing I like from [Alex Azimbaev](https://medium.com/@alex-azimbaev/building-ai-agents-that-actually-ship-a-practical-guide-for-2025-0c84e2233218): 2024 was the year of prototypes and proof-of-concepts — everyone was experimenting, few were shipping. 2025 is when the infrastructure caught up with the ambition. The models got better, the tooling matured, and the patterns solidified enough that teams could actually build on them. That's the moment we're in now, and it's worth understanding properly.

We're starting at the foundation. Not because you're not smart, but because a lot of the confusion I see in teams — developers included — comes from shaky mental models at the base level. So before we talk about agents, workflows, and team structure, let's make sure we're speaking the same language.

---

## What Generative AI Actually Is (and Isn't)

<!-- ![A developer sitting at a desk at night, monitor glow on their face, code on screen and a chat interface beside it](/static/blog/agentic-ai/part-1-hero.png) -->

<!-- IMAGE: Hero image — wide, editorial style. A developer sitting at a desk at night, monitor glow on their face, code on screen but also a chat interface open beside it. Cinematic, photorealistic, slightly warm lighting. Mood: curious, focused, not overwhelming. -->

You've heard the term a thousand times. Let me give you the version that actually sticks.

Generative AI is software that produces new content — text, code, images, audio — rather than just classifying or retrieving existing content. The "generative" part is the key distinction. A search engine finds things. A recommendation algorithm ranks things. Generative AI *creates* things.

But here's what it isn't: it isn't thinking. It isn't conscious. And at its core, it isn't looking things up in a database — it's generating responses based on patterns learned during training. (Worth noting: models *can* be augmented with retrieval systems — a technique called RAG — but that's a layer added on top, not how the model itself works. We'll get there.)

What it's doing is, in a very real sense, sophisticated pattern completion — trained on enormous amounts of human-produced content, it's learned to continue patterns in ways that are coherent, contextually aware, and often genuinely useful.

A useful (if imperfect) analogy: imagine someone who has read virtually everything ever written on the internet, absorbed the patterns of how ideas connect, how arguments are structured, how code is written — and can now produce fluent, contextually appropriate responses at the drop of a hat. They're not retrieving a memorized answer. They're constructing one, on the fly, based on everything they've absorbed.

<!-- IMAGE: Inline illustration — a stylized human silhouette sitting inside a vast library, surrounded by towering bookshelves spiraling upward into infinity, books flying open around them. Flat design or editorial illustration style, blue and warm gold tones. -->

That's generative AI. Impressive? Yes. Magic? No. And understanding that distinction matters a lot for using it well.

---

## LLMs: The Engine Under the Hood

The dominant technology powering generative AI right now is the **Large Language Model**, or LLM. Models like GPT-4, Gemini, and Claude are all LLMs. Here's what that means in plain terms.

An LLM is a neural network trained to predict what comes next in a sequence of text. That's it. The trick is that when you train a model that's large enough, on data that's diverse enough, something remarkable happens: it starts to generalize. It doesn't just learn to complete sentences. It learns grammar, reasoning, code syntax, tone, domain knowledge, logical structure — all as emergent properties of trying to predict the next token really, really well.

Let's pause on one term here, because it comes up constantly: a **token**. Tokens are roughly words or word fragments — the atomic unit an LLM actually works with. When you type a message, the model doesn't see letters or sentences — it sees tokens, processes them through layers of the neural network, and produces the most probable continuation. Why does this matter? Because tokens are the unit of context, cost, and rate limits throughout this entire space. The more you understand them, the less mysterious pricing, context windows, and latency will feel later in this series.

<!-- IMAGE: Diagram-style illustration — a horizontal flow showing: "Your text" → broken into small labeled chunks (tokens) → passing through a glowing neural network (abstract layered nodes) → output text emerging on the other side. Clean, minimal, infographic style with a dark background and neon blue/purple accent colors. -->

A few things worth internalizing:

**Context is everything.** LLMs don't have long-term memory by default. Everything they know about your situation exists inside the *context window* — the text currently in the conversation. Think of it like working memory. Once the conversation ends, it's gone — unless the system is explicitly designed to persist it. (Spoiler: good agents are.)

**The same prompt can produce different outputs.** LLMs are often non-deterministic — ask the same question twice and you may get two different answers. This surprises a lot of people the first time they hit it, and it has real implications for reliability and testing. It's a feature as much as a bug, but it's something to design around.

**They can be wrong with confidence.** Because the model is generating plausible text rather than retrieving verified facts, it can produce fluent, confident-sounding nonsense. The technical term is "hallucination." It's one of the key challenges we'll come back to throughout this series.

**Bigger isn't always better.** There are large, powerful models for complex reasoning tasks, and smaller, faster, cheaper models for simpler ones. Part of working well with this technology is knowing which to reach for.

---

## From Chatbot to Agent: What Changed

For a while, LLMs mostly lived inside chat interfaces. You typed, it replied. Useful, but limited — more like a very smart search box than a collaborator.

The shift happened when developers started giving models access to **tools**.

Instead of just generating text, a model could now call a function, read a file, search the web, run a terminal command, and act on the result. Suddenly it wasn't just answering questions — it was *doing* things. And when you chain those actions together — plan, act, observe, plan again — you get what we now call an **agent**.

<!-- IMAGE: Side-by-side illustration — LEFT: a simple chat bubble exchange between a person and a bot, labeled "Chatbot." RIGHT: a circular loop diagram showing: Prompt → Reason → Act (with small icons: file, terminal, browser) → Observe → back to Reason, labeled "Agent." Clean flat design, same dark background, the agent side noticeably more dynamic and interconnected. -->

Think of the difference this way. A chatbot is like calling a consultant and asking for advice. An agent is like hiring that consultant, giving them access to your systems, and having them actually do the work — file the report, send the email, run the build.

That's a fundamentally different relationship with the technology. And it comes with fundamentally different considerations around trust, control, and oversight — all of which we'll dig into later in this series.

---

## Why This Moment Matters for Your Team

I want to take a step back here, because I know some of you reading this are developers who already live in this world, and some of you are team leads or PMs trying to figure out what the noise actually means for your roadmap.

For both of you: this is not a marginal productivity improvement. It's a shift in the nature of the work.

Developers are spending less time on implementation boilerplate and more time on architecture, judgment, and review. Team leads are managing outputs from humans *and* agents. PMs are scoping work differently because the cost of certain tasks has dropped dramatically. The org chart hasn't changed yet — but the workflows already have.

<!-- IMAGE: Editorial illustration — a bird's-eye view of a modern open-plan office, but half the "desks" are occupied by glowing AI terminals rather than people, while humans cluster around whiteboards and review screens together. Slightly stylized, warm and optimistic in mood — not dystopian. Isometric illustration style. -->

None of that means jobs are disappearing tomorrow. But it does mean that the teams who understand this technology — really understand it, not just have a vague sense that "AI is a thing" — will make meaningfully better decisions than those who don't.

That's the gap this series is trying to close.

---

## What's Coming Next

In the next article, we go hands-on. We'll break down what a coding agent actually is — not the marketing version, but the mechanical reality: what it does, how it reasons, where it gets things wrong, and what working with one actually looks like day-to-day.

We'll use Claude Code as our primary example, but the patterns apply broadly. If you've used Cursor, GitHub Copilot, or any of the other agents emerging in the space, you'll recognize the architecture.

The goal isn't to sell you on any particular tool. It's to give you the mental model that makes all of them make sense.

*See you in Part 2.*
