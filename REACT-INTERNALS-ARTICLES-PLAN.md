# React Internals — Under the Hood: Series Plan

## Series Theme

**"React doesn't do what you think it does."**

Every article follows the same arc: take something React developers think they understand, show that the real mechanism is different (and often simpler) than expected, then prove it with actual source code. The series is a myth-busting exercise — each article replaces a vague mental model with the real one.

This theme scales across all seven articles without forcing a single metaphor. Individual articles can use local analogies where helpful (a "notepad" for the hooks linked list, "double buffering" for the fiber tree), but these are disposable — they serve one article, not the series.

## Series Tone

Conversational, slightly irreverent, technically rigorous. Reference actual React source constructs, not just concepts. Open each article with a practical question every React developer has encountered, then peel back the source code to reveal the answer. The series builds progressively — early articles earn reader trust for the deeper cuts later.

---

## Article 1: How Hooks Really Work

**Slug:** `react-internals-1-how-hooks-work`
**Tags:** `[react, hooks, internals]`

**Opening hook:** "Why can't I call hooks inside an if statement?"

**Scope:**

- Hooks as a linked list on fiber nodes — one node per hook call, in call order
- The hook node: `memoizedState`, `queue`, `next`
- Mount vs. update dispatchers (`HooksDispatcherOnMount` / `HooksDispatcherOnUpdate`)
- `useState` on mount (create node) vs. re-render (read existing node, ignore initial value)
- Why dispatch (setState) is a stable reference — bound at mount time, never recreated
- Why conditional hooks break the positional mapping
- `useRef` and `useMemo` as further proof — same linked list, different payloads
- Brief mention: this list lives on a fiber node (forward reference to Article 4)

**Aha moment:** The rules of hooks exist because React uses a linked list indexed by call order, not by name.

**Misconception busted:** "Hooks are magic." They're a linked list.

**Source references:** `ReactFiberHooks.js`, `mountState`, `updateState`, `mountRef`, `HooksDispatcherOnMount`, `HooksDispatcherOnUpdate`

---

## Article 2: useEffect Is Not a Lifecycle Method

**Slug:** `react-internals-2-useeffect-is-not-a-lifecycle`
**Tags:** `[react, hooks, useEffect, internals]`

**Opening hook:** "Why does my useEffect run twice in dev mode?" and "My cleanup ran but the component didn't unmount. What?"

**Scope:**

- The mental model shift: effects synchronize with state, not with mount/unmount events
- Effect timing: passive effects run after paint, `useLayoutEffect` runs before paint
- The effect queue: how React collects, orders, and flushes effects
- Cleanup semantics: cleanup belongs to the *previous* render's closure, not to unmount
- Dependency comparison with `Object.is` — and why `[{}]` fires every render
- Strict Mode double-invocation: what it does and why (detecting impure effects)
- The effect lifecycle: create → deps change → destroy previous → create new

**Aha moment:** Cleanup runs for the *previous* render's values. It's "undo what the last render did," not componentWillUnmount.

**Misconception busted:** "`useEffect(() => {}, [])` is componentDidMount." It runs after paint, captures initial closures, and has no `this`. Fundamentally different.

**Source references:** `commitPassiveUnmountEffects`, `commitPassiveMountEffects`, `pushEffect`, `HasEffect` flag

---

## Article 3: From JSX to Pixels — What Happens When React "Renders"

**Slug:** `react-internals-3-jsx-to-pixels`
**Tags:** `[react, rendering, jsx, internals]`

**Opening hook:** "I added a console.log to my component and it printed twice. I only called setState once. What is going on?"

**Scope:**

- JSX compiles to `jsx()` / `createElement()` — React elements are plain objects, not DOM nodes
- The element tree: a lightweight description of what *should* exist
- The two-phase model: render phase (pure, interruptible) vs. commit phase (synchronous, touches DOM)
- What "rendering" actually means: calling your function, getting elements back, diffing — NOT touching the DOM
- Why a re-render doesn't necessarily mean a DOM update
- `React.memo`, `useMemo`, and bailout — when React skips work
- Strict Mode double-rendering explained (now it makes sense)

**Aha moment:** "Rendering" means calling your function and getting back a description. DOM mutation happens later, in a separate phase. Most renders change nothing in the DOM.

**Misconception busted:** "Re-render = expensive DOM work." A render is a function call; the commit phase is where the cost lives, and React skips it when nothing changed.

**Source references:** `react/jsx-runtime`, `ReactElement`, `beginWork`, `commitRoot`

---

## Article 4: The Fiber Tree — React's Internal Skeleton

**Slug:** `react-internals-4-fiber-tree`
**Tags:** `[react, fiber, architecture, internals]`

**Opening hook:** "Behind every component in your tree, there's an object React never shows you — the fiber."

**Scope:**

- The problem Fiber solves: the old recursive reconciler couldn't pause or prioritize work
- Fiber node anatomy: `type`, `stateNode`, `child`, `sibling`, `return`, `alternate`, `memoizedState`, `flags`, `lanes`
- The tree structure: child/sibling/return pointers (a linked structure, not a recursive tree)
- Current tree vs. workInProgress tree — double buffering
- How Article 1's hook linked list attaches via `memoizedState` (callback to Article 1)
- The work loop: `performUnitOfWork` → `beginWork` → `completeWork`
- Walking the tree iteratively instead of recursively — and why that matters

**Aha moment:** React replaced recursive tree traversal with an iterative linked structure so it can pause mid-render and resume later. Each fiber is a unit of work.

**Misconception busted:** "Virtual DOM is a copy of the real DOM." Fiber nodes aren't DOM nodes. They're work units. Only host fibers (`div`, `span`) correspond to actual DOM elements.

**Source references:** `ReactFiber.js`, `FiberNode` constructor, `createWorkInProgress`, `performUnitOfWork`

---

## Article 5: Reconciliation — How React Decides What Changed

**Slug:** `react-internals-5-reconciliation`
**Tags:** `[react, reconciliation, diffing, keys, internals]`

**Opening hook:** "I used array index as a key and my input fields got scrambled. Why does React care about keys so much?"

**Scope:**

- The two heuristics that make O(n) diffing possible (same type = same subtree, keys identify siblings)
- Single-child reconciliation: type check → bailout or replace
- List reconciliation: the keyed diffing algorithm, first-pass and second-pass
- What happens when a key changes: full destroy + remount (the `key` prop reset pattern)
- Effect flags: `Placement`, `Update`, `Deletion` — how reconciliation marks work for the commit phase
- Why changing component identity (wrapping in a new HOC, inline component definitions) causes remounts
- The commit phase: walking the fiber tree and applying DOM mutations

**Aha moment:** Keys aren't a performance hint — they're identity. Changing a key tells React "this is a different thing entirely." That's why `key` works as a component reset mechanism.

**Misconception busted:** "React diffs the entire tree every render." React only diffs children of components that actually re-rendered, and bails out early and aggressively.

**Source references:** `ReactChildFiber.js`, `reconcileChildFibers`, `reconcileSingleElement`, `reconcileChildrenArray`, `Placement`/`ChildDeletion` flags

---

## Article 6: State Updates, Batching, and the Lane Model

**Slug:** `react-internals-6-state-updates-and-lanes`
**Tags:** `[react, state, batching, scheduler, lanes, internals]`

**Opening hook:** "I called setState three times in a row and only got one re-render. But in React 17, putting setState in a setTimeout gave me three renders. What changed?"

**Scope:**

- What happens when you call `setState`: an update object is enqueued, not applied immediately
- Update queues: the circular linked list of pending updates on a fiber
- Batching: React 18's automatic batching (all updates batch, everywhere)
- The lane model: priority bits that replaced the old expiration time system
- `SyncLane`, `DefaultLane`, `TransitionLane` — what they mean and when they're assigned
- How `startTransition` works: marking updates with a lower-priority lane
- `flushSync`: the escape hatch for synchronous flushing
- How React decides when to process which lanes

**Aha moment:** `setState` doesn't set state. It enqueues an update. React processes updates in batches, grouped by priority lane, then re-renders.

**Misconception busted:** "setState is asynchronous." It isn't async (no promises, no event loop). It's *deferred* — synchronously enqueued, render scheduled.

**Source references:** `ReactFiberLane.js`, `SyncLane`, `DefaultLane`, `TransitionLane`, `processUpdateQueue`, `ensureRootIsScheduled`

---

## Article 7: Concurrent React — Suspense, Transitions, and the Scheduler

**Slug:** `react-internals-7-concurrent-react`
**Tags:** `[react, concurrent, suspense, transitions, scheduler, internals]`

**Opening hook:** "I wrapped my slow list in startTransition and it stopped freezing the input. But how? React is still single-threaded."

**Scope:**

- The scheduler: `Scheduler_scheduleCallback`, priority levels, the MessageChannel trick for yielding
- Time slicing: React yields every ~5ms to keep the main thread responsive
- `shouldYield()` and the interruptible render loop
- Suspense internals: throwing a promise, the boundary catching it, fallback rendering
- How Suspense integrates with Fiber: `SuspenseComponent`, `OffscreenComponent`
- Transitions: rendering at lower priority without blocking urgent updates
- `useDeferredValue`: rendering a deferred copy of a value in a transition lane
- The payoff: Fiber made rendering interruptible (Article 4), lanes made updates prioritizable (Article 6), the scheduler makes it cooperative (this article)

**Aha moment:** Concurrent React isn't multithreading. It's cooperative scheduling on a single thread — React voluntarily pauses its own work to let the browser breathe, then resumes where it left off.

**Misconception busted:** "Suspense is just a loading spinner component." It's a coordination primitive — React pauses rendering a subtree, shows a fallback, retries when the promise resolves, all without the component knowing it was suspended.

**Source references:** `Scheduler.js`, `shouldYieldToHost`, `performConcurrentWorkOnRoot`, `throwException` (Suspense), `renderRootConcurrent`

---

## Series Dependency Graph

```
Article 1 (Hooks)
    │
    v
Article 2 (useEffect)        Article 3 (JSX → Render → Commit)
                                  │
                                  v
                              Article 4 (Fiber) ← callbacks to Article 1
                                  │
                                  v
                              Article 5 (Reconciliation)
                                  │
                                  v
                              Article 6 (State & Lanes)
                                  │
                                  v
                              Article 7 (Concurrent React) ← everything converges
```

Articles 1–2 are a self-contained "hooks deep dive" mini-arc. Article 3 pivots to the rendering pipeline. Article 4 is the central pillar — everything after builds on fiber knowledge. Articles 5–7 form the "how React processes work" arc, culminating in concurrent features as the payoff.

---

## Conventions

- **Slugs:** `react-internals-{n}-{kebab-case-topic}`
- **Tags:** Always include `react` and `internals`, plus topic-specific tags
- **Footer:** Each article ends with *Part of the "React Internals — Under the Hood" series.*
- **Forward teaser:** Each article (except the last) ends with a "What's Next" section teasing the next article's opening question
- **Source references:** Every article cites specific React source files/functions, with simplified pseudo-code excerpts where helpful
- **Diagrams:** Mermaid diagrams for data structures and flows (fiber trees, linked lists, phase diagrams)
