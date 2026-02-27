---
title: "React Component Structure: The Calm, Predictable Way"
slug: react-component-structure
date: 2025-02-27
description: "A clean, consistent, scalable structure for React function components."
tags: [react, components, architecture]
draft: false
---

# React Component Structure: The Calm, Predictable Way to Write Function Components

There’s no official law that says how a React function component must be structured.

But there *is* a difference between:

> “This component works.”

and

> “Ahhh. Yes. This sparks joy.”

This guide lays out a clean, consistent, scalable structure for React function components — and then dives into the technical reasons why it works.

---

# The Ideal Order (The “React Sandwich”)

Here’s the preferred structure inside a component, top to bottom:

1. Props destructuring
2. State
3. Refs
4. Context
5. Custom hooks
6. Memoized values (`useMemo`)
7. Callbacks / handlers (`useCallback` or `handleX`)
8. Effects
9. Guard clauses (early returns)
10. Render helpers
11. The return JSX

Let’s break it down.

---

## 1️⃣ Props Destructuring

```tsx
type Props = {
  title: string;
  isVisible: boolean;
};

export function MyComponent({ title, isVisible }: Props) {
```

Why first?

- It defines the component’s contract.
- Everything else depends on it.
- It immediately tells the reader what this component consumes.

Think of it as the ingredient list before cooking.

---

## 2️⃣ State

```tsx
const [count, setCount] = useState(0);
```

State is the component’s internal memory. It should be declared early because:

- Other hooks may depend on it.
- It influences rendering.
- It defines behavior.

Hooks must always be called in the same order. Keeping state declarations grouped prevents conditional-hook chaos.

---

## 3️⃣ Refs

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

Refs are persistent containers across renders.

They belong near state because:
- They are stable across renders.
- They don’t trigger re-renders.
- They’re part of component memory.

---

## 4️⃣ Context

```tsx
const theme = useContext(ThemeContext);
```

Context connects your component to the outside world.

It belongs with the “input layer” of your component:
- Props
- State
- Context

All sources of data come first.

---

## 5️⃣ Custom Hooks

```tsx
const { data, isLoading } = useUserData(userId);
```

Custom hooks encapsulate logic.

They belong before memoization and callbacks because:
- They often provide values used later.
- They may contain effects internally.
- They’re foundational behavior.

---

## 6️⃣ Memoized Values

```tsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

`useMemo` is for derived data.

It belongs after data sources because:
- It depends on state, props, or custom hooks.
- It prepares data for rendering.

Think of this as your “data transformation” layer.

---

## 7️⃣ Callbacks / Handlers

```tsx
const handleClick = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);
```

Callbacks often:
- Use state
- Use memoized values
- Trigger effects indirectly

They belong after memoized values because they may depend on them.

Keeping them grouped also makes it easier to audit dependencies.

---

## 8️⃣ Effects

```tsx
useEffect(() => {
  document.title = `${title} (${count})`;
}, [title, count]);
```

Effects synchronize with the outside world.

They come after all logic because:
- They depend on everything above.
- They represent side effects.
- They are not pure computation.

Putting effects last makes the dependency chain visually obvious.

---

## 9️⃣ Guard Clauses (Early Returns)

```tsx
if (!isVisible) return null;
if (isLoading) return <Spinner />;
```

Guard clauses:

- Improve readability
- Reduce nesting
- Fail fast

They come right before render helpers and JSX.

Why not earlier?

Because hooks must run unconditionally. You can’t early-return before them.

---

## 🔟 Render Helpers

```tsx
function renderItem(item: Item) {
  return <li key={item.id}>{item.name}</li>;
}
```

Render helpers:

- Keep JSX clean
- Extract conditional logic
- Improve readability

They belong close to the final return, because they’re purely about presentation.

---

## 1️⃣1️⃣ Return JSX

```tsx
return (
  <div>
    <h1>{title}</h1>
    <button onClick={handleClick}>{count}</button>
    <ul>{sortedItems.map(renderItem)}</ul>
  </div>
);
}
```

This is the output.

Everything above builds toward this moment.

---

# Why This Order Works (The Technical Deep Dive)

Now let’s get into the mechanics.

---

## 🔁 Hooks Must Run in the Same Order

React relies on call order to associate state with hook calls.

This is why this is illegal:

```tsx
if (isVisible) {
  const [count, setCount] = useState(0); // ❌
}
```

If the hook order changes between renders, React breaks.

Keeping all hooks at the top guarantees stability.

---

## 🧠 Data Flow Should Move Downward

Good components read like a pipeline:

Inputs
↓
Internal State
↓
Derived Values
↓
Side Effects
↓
Render

This structure mirrors how React actually works.

---

## 🧮 Dependency Clarity

When everything is grouped:

- It’s easy to scan for dependency issues.
- It’s easier to fix `react-hooks/exhaustive-deps` warnings.
- You can visually trace logic.

If a callback depends on `sortedItems`, you’ll see `sortedItems` declared above it.

---

## 🧱 Preventing “Component Soup”

Bad components look like this:

```tsx
const handleClick = ...
const [count, setCount] = ...
useEffect(...)
const value = useMemo(...)
```

Logic is scattered.

Order removes cognitive overhead.

---

# The Full Example

```tsx
type Props = {
  title: string;
  isVisible: boolean;
  items: Item[];
};

export function MyComponent({ title, isVisible, items }: Props) {
  // State
  const [count, setCount] = useState(0);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized values
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // Callbacks
  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  // Effects
  useEffect(() => {
    document.title = `${title} (${count})`;
  }, [title, count]);

  // Guards
  if (!isVisible) return null;

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>{count}</button>
      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

# Final Thoughts

This structure:

- Improves readability
- Reduces bugs
- Makes dependency management easier
- Scales across teams
- Makes code reviews smoother
- Makes ESLint rules easier to enforce

Most importantly:

It makes your components predictable.

And predictability is underrated engineering luxury.
