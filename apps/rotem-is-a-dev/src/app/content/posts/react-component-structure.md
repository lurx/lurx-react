---
title: "React Component Structure: The Calm, Predictable Way"
slug: react-component-structure
date: 2025-02-27
description: "A clean, consistent, scalable structure for React function components."
tags: [react, components, architecture]
draft: false
---

# React Component Structure: The Calm, Predictable Way to Write Function Components

No rule says how a React function component has to be laid out. The linter doesn't care. The bundler doesn't care.

There's still a difference between a component that works and a component you can read in one pass at 5 PM right before you start your weekend.

This is the order I use, and the reasons it holds up.

---

## The ideal order (the "React sandwich")

Top to bottom, inside every component:

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

Let's break it down.

---

### 1. Props destructuring

```tsx
type Props = {
  title: string;
  isVisible: boolean;
};

export function MyComponent({ title, isVisible }: Props) {
```

Props are the component's contract, and everything below depends on them. Put them first and the reader knows what goes in before they read what happens with it.

The ingredient list before the recipe.

---

### 2. State

```tsx
const [count, setCount] = useState(0);
```

State is the component's memory, and most of the hooks below it read from that memory. Declaring it early means a `useMemo` on line 30 never points at a `useState` on line 60.

Grouping the `useState` calls also makes it obvious at a glance that none of them sit inside a condition, which is the one thing React won't forgive.

---

### 3. Refs

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

A ref is memory too. Memory that survives renders without triggering one when it changes. That's the only real difference from state, and it's why refs sit directly underneath it.

---

### 4. Context

```tsx
const theme = useContext(ThemeContext);
```

Context is another input, and inputs belong together. Props come from the parent, state from the component, context from somewhere further up the tree. Read those three blocks and you know every value this component starts with.

---

### 5. Custom hooks

```tsx
const { data, isLoading } = useUserData(userId);
```

Custom hooks hand you values the rest of the component uses, and they often run effects of their own on the inside. Anything that hides an effect belongs above the code depending on its results.

---

### 6. Memoized values

```tsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

`useMemo` is derived data, so it can only come after the data it derives from. This is the transformation layer, with raw inputs above it and render-ready values below.

---

### 7. Callbacks / handlers

```tsx
const handleClick = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);
```

Handlers read state and memoized values, so they go after both.

Keeping them in one block also makes the dependency arrays easy to audit. Scattered `useCallback` calls are how stale closures survive code review.

---

### 8. Effects

```tsx
useEffect(() => {
  document.title = `${title} (${count})`;
}, [title, count]);
```

Effects are where the component reaches outside itself: the document title, a subscription, a fetch. They depend on everything above them, so they go last among the hooks. Read the file top to bottom and every dependency arrow points upward.

---

### 9. Guard clauses (early returns)

```tsx
if (!isVisible) return null;
if (isLoading) return <Spinner />;
```

An early return kills a whole branch of rendering in one line and saves you from wrapping the JSX in yet another condition.

They come after every hook, never before. Hooks have to run unconditionally on every render, so an early return above them changes the hook count between renders and React starts handing state to the wrong calls.

---

### 10. Render helpers

```tsx
function renderItem(item: Item) {
  return <li key={item.id}>{item.name}</li>;
}
```

A render helper is presentation and nothing else, so it lives next to the thing it renders into. Once a helper starts reaching for state or firing events, it wants to be a component.

---

### 11. Return JSX

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

The output. By the time you reach it, every value it references is already defined and named above.

---

## Why this order works

Now the mechanics.

---

### Hooks must run in the same order

React matches state to hook calls by order, not by name. There's no key, just a counter.

Which is why this is illegal:

```tsx
if (isVisible) {
  const [count, setCount] = useState(0); // ❌
}
```

Render once with `isVisible` true and once with it false, and the counter shifts. Every hook after this one gets handed the wrong slot. Keeping all hooks at the top makes that impossible.

---

### Data flow moves downward

Good components read like a pipeline: inputs → state → derived values → side effects → render.

That's the order React works in too, so the file matches the runtime.

---

### Dependency clarity

If a callback depends on `sortedItems`, then `sortedItems` is declared above it. Always.

That one guarantee turns a `react-hooks/exhaustive-deps` warning into a two-second fix instead of a scavenger hunt through the file.

---

### Preventing "component soup"

Scrambled components look like this:

```tsx
const handleClick = ...
const [count, setCount] = ...
useEffect(...)
const value = useMemo(...)
```

Nothing there is wrong. It just costs a full read to work out what depends on what, every time anyone opens the file.

---

## The full example

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

## Final thoughts

None of this makes a component faster. It makes it predictable. You know where to look for a handler, where a value came from, and whether a hook is safe to move.

Predictability is a badly underrated luxury. Every component opens the same way, and after a week you stop reading the structure at all and just read the logic.
