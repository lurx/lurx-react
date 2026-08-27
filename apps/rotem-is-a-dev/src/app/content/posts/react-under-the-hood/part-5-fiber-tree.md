---
title: "The Fiber Tree: React Internals, Part 5"
slug: react-internals-5-fiber-tree
date: 2026-08-27
description: "Behind every component in your tree, there's an object React never shows you. It's called a fiber, and it's the data structure that makes everything else in React possible."
tags: [react, fiber, architecture, internals]
draft: false
series: react-under-the-hood
seriesOrder: 5
---

*Behind every component in your tree, there's an object React never shows you. It's called a fiber, and it's the data structure that makes everything else in React possible.*

---

## The problem that created fiber

Before React 16, rendering was recursive. When you called `setState`, React would walk down from the updated component through every child, grandchild, and great-grandchild, synchronously, in one uninterruptible pass. If you had a tree of a thousand components, React would process all thousand before yielding back to the browser.

This meant a large update could block the main thread for tens of milliseconds. No user input could be processed. No animations could advance. The browser was frozen until React finished thinking.

The React team needed to solve two problems:

1. **Interruptibility.** The ability to pause rendering mid-tree, let the browser handle urgent work (input, animation), and resume later.
2. **Priority.** The ability to decide that some updates (a typed character) matter more than others (a chart re-rendering in the background).

Recursion can't do either of these things. When you're halfway through a recursive call stack, you can't pause. The state lives on the call stack, and yielding means losing it all. You also can't reorder work, because the call stack dictates the execution order.

The solution was to replace the call stack with a data structure, taking the information that normally lives in stack frames and putting it into objects React controls. That data structure is the **fiber tree**. And if it sounds like overengineering, keep reading. By the end of this article you'll see why it had to be this way.

---

## What is a fiber?

A fiber is a plain JavaScript object that represents a unit of work. There is one fiber for every component instance, every DOM element, and every other node in your React tree.

The [`FiberNode` constructor](https://github.com/facebook/react/blob/v19.2.8/packages/react-reconciler/src/ReactFiber.js) creates objects that look like this (simplified):

```js
{
  // What this fiber represents
  tag: FunctionComponent,  // or HostComponent, HostText, etc.
  type: MyComponent,       // the function/class, or 'div', 'span'
  key: null,               // from the JSX key prop
  stateNode: null,         // for host fibers: the actual DOM node

  // Tree structure
  child: Fiber | null,     // first child
  sibling: Fiber | null,   // next sibling
  return: Fiber | null,    // parent

  // Work state
  memoizedState: ...,      // for function components: the hook linked list
  memoizedProps: ...,       // props from the last completed render
  pendingProps: ...,        // props for the current in-progress render
  flags: NoFlags,          // what kind of work this fiber needs (Placement, Update, Deletion)
  lanes: NoLanes,          // priority of pending work

  // Double buffering
  alternate: Fiber | null, // the other version of this fiber
}
```

That's a lot of fields. Don't memorize them. We'll revisit the important ones as we go. The one to notice right now is `memoizedState`. If you've read [Part 1](/blog/react-internals-1-how-hooks-work), you already know what lives there: the hooks linked list. Every `useState`, `useRef`, and `useEffect` call writes to a node in that list, and the list hangs off this fiber. The fiber is the persistent identity of your component across renders. It's what makes hooks *work*.

---

## The tree that isn't a tree

A typical component tree looks like this:

```jsx
function App() {
  return (
    <main>
      <Header />
      <Content>
        <Sidebar />
        <Article />
      </Content>
    </main>
  );
}
```

You'd expect the fiber tree to mirror this, a parent with children branching out. But fibers don't form a traditional tree with arrays of children. They use three pointers:

- **`child`** points to the *first* child.
- **`sibling`** points to the *next* sibling.
- **`return`** points to the *parent*.

```mermaid
graph TD
  App["App"] -->|child| Main["main"]
  Main -->|child| Header["Header"]
  Header -->|sibling| Content["Content"]
  Content -->|child| Sidebar["Sidebar"]
  Sidebar -->|sibling| Article["Article"]

  Header -->|return| Main
  Content -->|return| Main
  Sidebar -->|return| Content
  Article -->|return| Content
  Main -->|return| App
```

Children are linked as a singly-linked list: `main.child → Header`, `Header.sibling → Content`. To get from a parent to its second child, React goes through the first child, then follows siblings.

It looks weird if you're used to `children: []` arrays. But this structure has a crucial property: it can be traversed iteratively with a simple loop. No recursion, no call stack, no state to lose if you pause. Three pointers. That's the entire trick that makes concurrent React possible.

---

## Walking the tree: the work loop

The render phase is driven by a function called `performUnitOfWork`. It processes one fiber at a time in a predictable pattern:

1. **Go down.** Process the current fiber (`beginWork`). If it has a child, move to the child.
2. **Go sideways.** If there's no child (or the children are done), complete the current fiber (`completeWork`). If there's a sibling, move to the sibling and start step 1 again.
3. **Go up.** If there's no sibling, go back to the parent (`return`) and complete it. Repeat until you reach the root.

```js
// Simplified from the React reconciler
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber) {
  const next = beginWork(fiber);  // process this fiber, return its child

  if (next !== null) {
    workInProgress = next;        // has a child, go deeper
  } else {
    completeUnitOfWork(fiber);    // no child, complete and move sideways or up
  }
}
```

For the tree above, the traversal order is:

```text
beginWork(App) → beginWork(main) → beginWork(Header) →
completeWork(Header) → beginWork(Content) → beginWork(Sidebar) →
completeWork(Sidebar) → beginWork(Article) → completeWork(Article) →
completeWork(Content) → completeWork(main) → completeWork(App)
```

Every fiber gets a `beginWork` (entering) and a `completeWork` (leaving). The whole tree is processed in a single flat loop, with no recursion. If you've ever implemented a tree traversal without recursion in an interview, this is the same idea. Except it runs on every React app in the world.

And here's the payoff, the reason the React team rebuilt the entire renderer around this structure. Because the current position is stored in the `workInProgress` variable rather than on the call stack, React can stop the loop at *any* fiber, yield to the browser, and later resume exactly where it left off. The fiber tree is its own bookmark.

---

## beginWork and completeWork

These two functions are where the actual work happens.

**`beginWork`** looks at a fiber and decides what to do with it:

- **Function component?** Call the function. Reconcile the returned elements against the fiber's existing children (creating, updating, or marking fibers for deletion).
- **Host component (`div`, `span`)?** Compare old and new props. Reconcile children.
- **Nothing changed?** Bail out and skip this entire subtree.

This is where your component function gets called. It's also where [Part 3's](/blog/react-internals-3-jsx-to-pixels) "render phase" lives. `beginWork` *is* the render phase, one fiber at a time.

**`completeWork`** runs when a fiber and all its children are done. It:

- Creates or updates the actual DOM node for host fibers
- Bubbles flags up. If a child needs a DOM update, the parent's flags are marked too, so the commit phase knows to walk into this subtree
- Builds the effect list used by the commit phase

The separation is clean: `beginWork` goes top-down (processing components), `completeWork` goes bottom-up (preparing DOM nodes and collecting effects). Think of it like exploring a cave system. `beginWork` is going deeper, `completeWork` is marking the walls on your way back out.

---

## Two trees: current and workInProgress

Here's where things get clever. React doesn't modify fibers in place during rendering. Instead, it maintains **two versions** of the tree:

- **`current`** is the tree displayed on screen right now. The committed state.
- **`workInProgress`** is the tree being built during the current render. A draft.

Each fiber has an `alternate` pointer to its counterpart in the other tree:

```mermaid
graph LR
  subgraph Current["Current Tree (on screen)"]
    CA["App\ncount: 0"]
    CM["main"]
    CB["Button\n'0'"]
  end

  subgraph WIP["WorkInProgress Tree (being built)"]
    WA["App\ncount: 1"]
    WM["main"]
    WB["Button\n'1'"]
  end

  CA <-->|alternate| WA
  CM <-->|alternate| WM
  CB <-->|alternate| WB
```

When you call `setState`, React creates (or reuses) the `workInProgress` tree by cloning fibers from `current` via [`createWorkInProgress`](https://github.com/facebook/react/blob/v19.2.8/packages/react-reconciler/src/ReactFiber.js). It then processes the cloned fibers, calling component functions, updating `memoizedState` and `memoizedProps`, and marking `flags` for any DOM mutations needed.

When the render phase finishes and the commit phase applies all DOM changes, React swaps: the `workInProgress` tree *becomes* the new `current` tree. The old `current` becomes the next render's `workInProgress` (it gets reused, not discarded).

This is **double buffering**, the same technique used in game rendering and video playback. You build the next frame offscreen, then swap it in all at once. The user never sees a half-built state. And if something goes wrong during the render? React just throws away the draft. The current tree, the one the user is looking at, is untouched.

---

## Not every fiber is a component

One thing that trips people up: fibers don't just represent your components. There's also a fiber for every `<div>`, every `<span>`, every text node, every `<Fragment>`, every `<Suspense>` boundary. The `tag` field on each fiber tells React what kind of thing it is.

The important distinction: only fibers for DOM elements (`div`, `span`, `button`) have a `stateNode` pointing to an actual DOM node. Your `FunctionComponent` fibers? No DOM node. They're organizational. They exist for React's bookkeeping, not for the browser.

This is why "virtual DOM is a copy of the real DOM" is misleading. Open React DevTools on any app and count the components vs. the actual DOM elements. The fiber tree is much bigger, and most of it has nothing to do with the DOM.

---

## Flags: how React remembers what changed

As the render phase walks the tree, it doesn't modify the DOM directly. Instead, it leaves sticky notes on fibers: "this one needs to be inserted," "this one's props changed," "this one was deleted."

These sticky notes are called **flags**:

- `Placement` means "insert this node into the DOM".
- `Update` means "update this node's attributes or text".
- `ChildDeletion` means "remove a child, run its cleanup effects".

The clever part: flags bubble up. If a deeply nested fiber needs work, every ancestor gets a `Subtree` flag, a signal that says "something down here changed, walk into this branch." Subtrees with no flags? The commit phase skips them entirely. A tree of 10,000 fibers where only one leaf changed? React walks straight to it.

---

## The full picture

Here's how everything connects across the series so far:

```mermaid
graph LR
  Fiber["Fiber Node\n─────────────\ntype: MyComponent\nmemoizedProps\nflags: Update\nalternate →"]

  Fiber -->|"memoizedState"| H1

  H1["useState\ncount: 0"] --> H2["useRef\n{ current: null }"] --> H3["useEffect\ndeps: [count]"]

  Fiber -->|"child"| Child["Child Fiber"]
  Fiber -->|"sibling"| Sibling["Sibling Fiber"]
  Fiber -->|"return"| Parent["Parent Fiber"]
```

The fiber is the hub. Hooks live on it (Part 1). Effects synchronize from it (Part 2). The render phase calls functions through it (Part 3). The tree structure lets React traverse iteratively, pause anywhere, and resume later.

Everything you've learned in the series so far has been building toward this structure. And everything that follows, reconciliation, state updates, concurrent rendering, is operations *on* this structure. The fiber tree is the backbone. Everything else is muscles.

---

## The mental model, distilled

A fiber is a unit of work. The fiber tree is a to-do list that React can walk, pause, resume, and reprioritize.

It's not a copy of the DOM. It's not a virtual DOM (though that term has stuck and probably always will). It's a persistent data structure that tracks what your components are, what state they hold, and what work they need done, organized so React can process it one piece at a time without ever holding the main thread hostage.

If someone asks you "what's the virtual DOM?", you now have a better answer than most React developers.

---

## What's next

We've seen the tree. We know how React walks it. But what happens when `beginWork` finds that a component's children have changed, when elements were added, removed, or reordered?

That's **reconciliation**, React's diffing algorithm. In **Part 6, Reconciliation**, we'll see how React decides which fibers to create, update, or delete, why keys exist (and what happens when you get them wrong), and why the algorithm is O(n) instead of O(n³).

---

### React Internals: Under the Hood

1. [How Hooks Really Work](/blog/react-internals-1-how-hooks-work)
2. [useEffect Is Not a Lifecycle Method](/blog/react-internals-2-useeffect-is-not-a-lifecycle)
3. [From JSX to Pixels](/blog/react-internals-3-jsx-to-pixels)
4. [The Event System](/blog/react-internals-4-event-system)
5. **The Fiber Tree**
6. [Reconciliation](/blog/react-internals-6-reconciliation)
7. [State Updates, Batching, and the Lane Model](/blog/react-internals-7-state-updates-and-lanes)
8. [Concurrent React](/blog/react-internals-8-concurrent-react)
