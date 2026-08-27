---
title: "The `satisfies` Keyword in TypeScript (Or: Having Your Type Cake and Eating It Too)"
slug: typescript-satisfies
date: 2025-03-10
description: "How TypeScript's `satisfies` keyword validates your data without throwing away type inference, when to reach for it, and when a plain annotation is still the right call."
tags: [typescript]
draft: false
---
TypeScript 4.9 quietly slipped a new operator into our lives. `satisfies` solves one of those problems that's annoying enough to complain about, but never quite annoying enough to file an issue over. You know the one. You want TypeScript to *check* your value against a type, and the moment you add the annotation it forgets everything it just learned about your data, like a golden retriever after a loud noise.

That ends now.

---

## TypeScript's selective amnesia

Say you're building a color palette. Each color is either an RGB tuple or a hex string, very chic, very modern.

```typescript
type Color = [number, number, number] | string;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};
```

TypeScript is delighted. It knows `red` is a tuple. It knows `green` is a string. Everything is wonderful.

Now you want to be sure every entry is actually a valid `Color`. Reasonable. So you add a type annotation like a responsible developer.

```typescript
const palette: Record<string, Color> = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};
```

And TypeScript forgets *everything it knew*. Try to use `palette.green` like the string it obviously is.

```typescript
palette.green.toUpperCase(); // ❌ Error: Property 'toUpperCase' does not exist on type 'Color'
```

TypeScript now sees `Color`, the big vague union, instead of `string`. You asked it to validate, and in exchange it lobotomized itself. That's a bad trade and you shouldn't have to make it.

---

## The type check that doesn't forget

`satisfies` validates a value without replacing its inferred type. Less a type annotation, more a bouncer checking IDs. It confirms everything is in order, then steps aside and lets the night unfold.

```typescript
type Color = [number, number, number] | string;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, Color>;
```

TypeScript checks every entry against `Color`, and then keeps the inferred types intact.

```typescript
palette.green.toUpperCase(); // ✅ TypeScript still knows it's a string
palette.red[0];              // ✅ TypeScript still knows it's a tuple
```

Validation and precision, with no amnesia.

---

## `satisfies` vs. a plain annotation

Here's the difference, laid bare.

```typescript
type Routes = Record<string, { path: string; label: string }>;

// The old way. The annotation widens everything
const routes: Routes = {
  home:  { path: "/",      label: "Home"  },
  about: { path: "/about", label: "About" },
};
routes.nonexistent; // 😬 No error. Record<string, ...> allows any key

// The new way. satisfies validates without widening
const routes = {
  home:  { path: "/",      label: "Home"  },
  about: { path: "/about", label: "About" },
} satisfies Routes;
routes.nonexistent; // ❌ Error: Property 'nonexistent' does not exist
```

A plain annotation gives you back a `Record<string, ...>`, so TypeScript will let you reach for any key in the universe without complaint. `satisfies` validates the shape at declaration and keeps the specific structure, so `routes.nonexistent` fails the build.

---

## Where it actually saves your skin

### 1. Configuration objects

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
// That matters more than you'd think once you start being clever with it
```

### 2. Icon and asset maps

```typescript
type IconSize = "sm" | "md" | "lg";
type IconDef = { src: string; sizes: IconSize[] };

const icons = {
  search: { src: "/icons/search.svg", sizes: ["sm", "md"] },
  menu:   { src: "/icons/menu.svg",   sizes: ["sm", "md", "lg"] },
} satisfies Record<string, IconDef>;

icons.search.src; // ✅ TypeScript knows this exists, no ?. required
```

### 3. Exhaustive enum-like maps

```typescript
type Status = "active" | "inactive" | "pending";

const statusLabels = {
  active:   "Active",
  inactive: "Inactive",
  pending:  "Pending",
} satisfies Record<Status, string>;
```

Add a fourth `Status` someday and forget the label here, and the build fails on this object. That's the whole point.

### 4. Narrowing union members without the type-guard ceremony

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

const myShape = { kind: "circle", radius: 10 } satisfies Shape;

myShape.radius; // ✅ TypeScript knows this is the circle variant, no guard needed
```

Annotate `myShape: Shape` instead and TypeScript sees the full union, so `.radius` is off limits until you write a guard. `satisfies` validates the object as a `Shape` and keeps the narrow inferred type. Clean.

---

## Stacking `as const` and `satisfies`

Pair the two and you get literal narrowing plus validation in one swoop.

```typescript
const directions = ["north", "south", "east", "west"] as const satisfies string[];

// type: readonly ["north", "south", "east", "west"]
// It's validated as a string[], but each element keeps its literal type
```

Order matters. `as const` goes first to narrow the value, then `satisfies` checks the result against the broader type. Dress up before you reach the velvet rope.

---

## Gotchas

**It's compile-time only.** `satisfies` evaporates when TypeScript emits JavaScript. No wrapping, no casting, no runtime cost. A pre-flight check, not a seatbelt.

**It doesn't follow the object around.** Pass a `satisfies`-checked value into a function and TypeScript checks it again at that boundary, as if it had never seen it. This is declaration-time precision, not a lifelong guarantee.

**It's only as smart as your type.** Write the constraint with `string` instead of a literal union and typos sail straight through. TypeScript only looks for what you told it to look for.

---

## So when should you use it?

Reach for `satisfies` when you want the shape validated at declaration and the narrow inferred type everywhere after it. Lookup tables, config objects, route maps, status-to-label dictionaries. Anything where "this matches the contract" and "this is specifically *this*" both matter.

Stick with a plain annotation when you *want* the wide type: you plan to reassign the variable, you pass it around as the abstract type, or the inferred and annotated types are identical anyway.

---

## The bottom line

Before `satisfies`, the choice was annotate for safety or skip the annotation and keep the precision. The kind of trade-off that left you feeling vaguely guilty either way.

Now you can have both. Validate the data, keep the types, go home.

Small word, very satisfying job.
