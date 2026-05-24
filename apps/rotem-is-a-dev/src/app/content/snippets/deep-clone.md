---
title: deep-clone
slug: deep-clone
date: 2026-05-20
description: Recursively copy plain objects and arrays so nested mutations don't leak back to the source.
tags: [utility, immutability]
source: deep-clone.snippet.ts
---

A minimal recursive deep clone for plain JSON-shaped values: primitives, arrays, and plain objects. The implementation walks the structure with `Object.entries` and `map`, producing fresh containers at every level.

```include
deep-clone.snippet.ts
```

## Caveats

- Doesn't handle `Date`, `Map`, `Set`, `RegExp`, class instances, or circular references. For those, use `structuredClone` (when available in your target runtime) or a battle-tested library.
- Keys with `undefined` values survive the round-trip — unlike a `JSON.parse(JSON.stringify(...))` approach which would strip them.
