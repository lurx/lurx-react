---
title: memoize
slug: memoize
date: 2026-05-20
description: Cache a function's return value by its arguments so identical calls are skipped. Best for pure, deterministic functions.
tags: [utility, performance, caching]
source: memoize.snippet.ts
---

`memoize` wraps a function in a `Map`-backed cache keyed by the JSON serialization of its arguments. Re-invocations with previously-seen arguments return the cached result instead of recomputing.

```include
memoize.snippet.ts
```

## Caveats

- The cache key is `JSON.stringify(args)`. Non-serializable inputs (functions, symbols, circular structures) will throw or produce unstable keys.
- There's no eviction policy here — the cache grows forever. For long-lived applications, consider an LRU strategy.
- Only safe for **pure** functions. Memoizing a function with side effects suppresses those side effects on cache hits.
