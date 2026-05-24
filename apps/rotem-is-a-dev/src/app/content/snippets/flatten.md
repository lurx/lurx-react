---
title: flatten
slug: flatten
date: 2026-05-20
description: Recursively collapse a nested array into a single flat array. A deep version of Array.prototype.flat with explicit typing.
tags: [utility, arrays]
source: flatten.snippet.ts
---

A recursive flatten that drills through arrays of any depth. The signature accepts `(T | T[])[]` and returns `T[]` — so the type system reflects the collapse.

```include
flatten.snippet.ts
```

## Compared to `Array.prototype.flat`

- `arr.flat(Infinity)` does the same thing without the recursion, but with a wider type signature (`unknown[]`).
- This version keeps element typing precise when you know the leaf type up front.
