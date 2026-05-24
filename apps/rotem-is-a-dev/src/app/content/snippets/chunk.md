---
title: chunk
slug: chunk
date: 2026-05-20
description: Split an array into fixed-size sub-arrays. The final chunk holds the remainder when the length isn't a clean multiple.
tags: [utility, arrays]
source: chunk.snippet.ts
---

`chunk` divides an array into batches of `size` elements. The last batch may be shorter than `size` if the input length doesn't divide evenly. Throws a `RangeError` on non-positive sizes so misuse fails loudly.

```include
chunk.snippet.ts
```

## Common uses

- Paginating large arrays for batched rendering or API calls.
- Building grid rows from a flat list of cells.
- Rate-limiting bulk operations by processing a fixed number per tick.
