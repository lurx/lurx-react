---
title: group-by
slug: group-by
date: 2026-05-20
description: Bucket an array of objects into a record keyed by one of their fields. The functional alternative to a manual reduce.
tags: [utility, arrays]
source: group-by.snippet.ts
---

`groupBy` walks an array once and bins each item under the string form of `item[key]`. Useful for building lookup tables, rendering grouped lists, or reducing flat data to a categorized shape.

```include
group-by.snippet.ts
```

## Notes

- The key value is coerced via `String(...)` so numeric and boolean fields work, but at the cost of losing their original type as a record key.
- For the standard-library equivalent on modern runtimes, see `Object.groupBy` (ES2024).
