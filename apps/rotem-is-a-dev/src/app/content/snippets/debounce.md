---
title: debounce
slug: debounce
date: 2026-05-20
description: Delay invoking a function until a quiet period has passed since the last call. Great for input handlers and resize listeners.
tags: [utility, performance, timing]
source: debounce.snippet.ts
---

`debounce` wraps a function so that repeated calls reset a timer; the wrapped callback only fires once the caller has gone quiet for `delay` milliseconds. Typical uses: search-as-you-type inputs, window resize handlers, autosave triggers.

```include
debounce.snippet.ts
```

## Notes

- The generic constraint `T extends (...args: unknown[]) => void` keeps the argument types intact while enforcing a void return — the caller's return value is discarded by design.
- Each call clears the previous timer, so only the **last** invocation in a burst executes.
