---
title: "The `satisfies` Keyword in TypeScript (Or: Having Your Type Cake and Eating It Too)"
slug: typescript-satisfies
date: 2025-03-10
description: "Explore TypeScript's `satisfies` keyword — how it validates your data without sacrificing type inference. Learn when and why to use it over traditional type annotations, with real-world examples."
tags: [typescript]
draft: false
---

# The `satisfies` Keyword in TypeScript (Or: Having Your Type Cake and Eating It Too)

TypeScript 4.9 quietly slipped a new operator into our lives — `satisfies` — and it solves one of those problems that's just annoying enough to complain about but not quite annoying enough to file an issue over. You know the one. You want TypeScript to *check* your value against a type, but the moment you slap on an annotation, it forgets everything it just learned about your data like a golden retriever after a loud noise.

That ends now.

---

## The Problem: TypeScript's Selective Amnesia

Let's say you're building a color palette. Each color can be either an RGB tuple or a hex string — very chic, very modern:

```typescript
type Color = [number, number, number] | string;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};
```

TypeScript is delighted. It knows `red` is a tuple. It knows `green` is a string. Everything is wonderful.

Now you want to make sure every entry is actually a valid `Color`. Reasonable! You add a type annotation like a responsible developer:

```typescript
const palette: Record<string, Color> = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};
```

And TypeScript promptly forgets *everything it knew*. Try to use `palette.green` like the string it obviously is:

```typescript
palette.green.toUpperCase(); // ❌ Error: Property 'toUpperCase' does not exist on type 'Color'
```

Right. Because now TypeScript only sees `Color` — the big, vague union — not `string`. You asked it to validate, and in exchange it lobotomized itself. You've traded inference for validation, and frankly, that's a bad deal.

---

## Enter `satisfies`: The Type Check That Doesn't Forget

The `satisfies` operator is what you reach for when you want TypeScript to *validate* a value without *replacing* its inferred type. Think of it less like a type annotation and more like a bouncer checking IDs — it confirms everything is in order, then steps aside and lets the night unfold:

```typescript
type Color = [number, number, number] | string;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, Color>;
```

TypeScript checks every entry against `Color`. ✅ Passes. And then — crucially — it keeps the inferred types completely intact:

```typescript
palette.green.toUpperCase(); // ✅ Works — TypeScript still knows it's a string
palette.red[0];              // ✅ Works — TypeScript still knows it's a tuple
```

Validation *and* precision. No compromise. No amnesia.

---

## `satisfies` vs. Type Annotation: A Dramatic Showdown

Here's the fundamental difference, laid bare:

```typescript
type Routes = Record<string, { path: string; label: string }>;

// The old way — annotation widens everything
const routes: Routes = {
  home:  { path: "/",      label: "Home"  },
  about: { path: "/about", label: "About" },
};
routes.nonexistent; // 😬 No error — Record<string, ...> allows any key

// The new way — satisfies validates without widening
const routes = {
  home:  { path: "/",      label: "Home"  },
  about: { path: "/about", label: "About" },
} satisfies Routes;
routes.nonexistent; // ❌ Error: Property 'nonexistent' does not exist
```

With a plain annotation, you get a `Record<string, ...>` back, which means TypeScript will happily let you access any key in the universe with zero complaints. With `satisfies`, TypeScript validates the shape at declaration but preserves the known, specific structure — so phantom key access gets caught.

---

## Real-World Use Cases (Where It Actually Saves Your Skin)

### 1. Configuration Objects

```typescript
type AppConfig = {
  port: number;
  host: string;
  debug: boolean;
};

const config = {
  port: 3000,
  host: "localhost",
  debug: true,
} satisfies AppConfig;

// config.port is still typed as the literal `3000`, not just `number`
// That matters more than you'd think once you start doing clever things with it
```

### 2. Icon or Asset Maps

```typescript
type IconSize = "sm" | "md" | "lg";
type IconDef = { src: string; sizes: IconSize[] };

const icons = {
  search: { src: "/icons/search.svg", sizes: ["sm", "md"] },
  menu:   { src: "/icons/menu.svg",   sizes: ["sm", "md", "lg"] },
} satisfies Record<string, IconDef>;

icons.search.src; // ✅ TypeScript knows this exists, no ?. required
```

### 3. Exhaustive Enum-Like Maps (The "I Definitely Won't Forget to Update This" Pattern)

```typescript
type Status = "active" | "inactive" | "pending";

const statusLabels = {
  active:   "Active",
  inactive: "Inactive",
  pending:  "Pending",
} satisfies Record<Status, string>;
```

Add a new `Status` someday and forget to add a label here? TypeScript will remind you. Loudly. That's the whole point.

### 4. Narrowing Union Members Without a Type Guard Ceremony

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

const myShape = { kind: "circle", radius: 10 } satisfies Shape;

myShape.radius; // ✅ TypeScript knows this is the circle variant, no guard needed
```

Without `satisfies`, annotating `myShape: Shape` means TypeScript sees the full union and won't let you touch `.radius` without a type guard. With `satisfies`, it validates the object as a `Shape` while keeping the specific inferred type. Clean.

---

## The `as const satisfies` Combo (Yes, You Can Stack Them)

You can pair `satisfies` with `as const` to get literal narrowing *and* type validation in one swoop:

```typescript
const directions = ["north", "south", "east", "west"] as const satisfies string[];

// type: readonly ["north", "south", "east", "west"]
// It's validated as a string[], but each element keeps its literal type
```

Order matters here: `as const` goes first to narrow the value, then `satisfies` validates the result against the broader type. Think of it as dressing up before going through the velvet rope.

---

## Gotchas to Keep in Your Back Pocket

**It's purely compile-time.** `satisfies` evaporates entirely when TypeScript compiles to JavaScript. No wrapping, no casting, no runtime cost. It's a pre-flight check, not a seatbelt.

**It doesn't follow your object around.** Once you pass a `satisfies`-checked value to a function, TypeScript checks it again at that boundary like it's never seen it before. `satisfies` is about declaration-time precision, not a lifelong guarantee.

**It's only as smart as your type.** If your constraint type uses `string` instead of a literal union, TypeScript can't catch typos in string values — it only knows what you told it to look for. Garbage in, garbage out, as always.

---

## So When Should You Actually Use It?

Reach for `satisfies` when you want to *validate* a value's shape at declaration but need the rest of your code to enjoy the fully-inferred, narrow type. It shines brightest with lookup tables, config objects, route maps, status-to-label dictionaries, and any structure where "this matches the contract" and "this is specifically *this*" both matter.

Stick with a plain type annotation when you *want* the widened type — when you plan to reassign the variable, pass it around as the abstract type, or when the inferred and annotated types would be the same anyway.

---

## The Bottom Line

Before `satisfies`, TypeScript forced an uncomfortable choice: annotate for safety, or skip the annotation and keep the precision. It was the kind of trade-off that made you feel vaguely guilty no matter which option you picked.

`satisfies` is TypeScript's way of saying: you can have both. Validate your data. Keep your types. Go home happy.

It's a small word with a very satisfying job.
