---
title: throttle
slug: throttle
date: 2026-05-20
description: Cap how often a function can run by enforcing a minimum interval between invocations. Great for scroll and mousemove handlers.
tags: [utility, performance, timing]
source: throttle.snippet.ts
---

`throttle` returns a wrapper that runs `fn` at most once per `limit` milliseconds. Unlike `debounce`, calls during the cooldown are dropped rather than deferred — so the **first** call in a burst wins instead of the last.

```include
throttle.snippet.ts
```

## When to reach for it

- Scroll-position trackers that only need to update every ~100ms.
- High-frequency mousemove handlers driving cheap visual updates.
- Rate-limiting analytics events from rapid user interactions.
