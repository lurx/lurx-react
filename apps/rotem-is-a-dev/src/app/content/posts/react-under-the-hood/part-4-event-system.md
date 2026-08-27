---
title: "The Event System: React Internals, Part 4"
slug: react-internals-4-event-system
date: 2026-08-27
description: "You think onClick attaches a click handler to your button. It doesn't. React's event system is a layer of indirection you've been using every day without knowing it exists."
tags: [react, events, internals]
draft: false
series: react-under-the-hood
seriesOrder: 4
---

*You think `onClick` attaches a click handler to your button. It doesn't. React's event system is a layer of indirection you've been using every day without knowing it exists.*

---

## The event that wasn't there

Open React DevTools. Inspect a `<button onClick={handleClick}>`. Now switch to the Elements panel and look at the actual DOM node.

There's no `onclick` attribute. No `addEventListener('click', handleClick)` on the button. Your handler isn't there.

Instead, React attached a single event listener to the **root of your app**, the DOM node you passed to `createRoot`. The wiring lives in [`ReactDOMEventListener.js`](https://github.com/facebook/react/blob/v19.2.8/packages/react-dom-bindings/src/events/ReactDOMEventListener.js), where `createEventListenerWrapperWithPriority` builds the listener and `dispatchEvent` receives every native event. Every click, every keypress, every input event in your entire application is caught by that one listener, and React figures out which component handler to call.

If that sounds like event delegation, it is. The same pattern from the jQuery days. But React's version goes further than "attach one listener to a parent." It's a full event processing pipeline with its own propagation, its own event objects, and its own rules. And understanding it explains a handful of bugs you've probably hit without knowing why.

---

## Why not use native events?

You might wonder: why not just call `button.addEventListener('click', handleClick)` and be done with it? React had several reasons:

**Consistency across browsers.** When React was created in 2013, browser event behavior was inconsistent. `onChange` didn't fire the same way in IE. Focus events bubbled in some browsers and not others. React's synthetic event layer normalized these differences, so you got the same behavior everywhere.

**Integration with React's rendering model.** Native event handlers are attached to DOM nodes. But in React, the DOM node might not exist yet during the render phase. It's only created during the commit phase. And the handler might change between renders. React needs an indirection layer to wire up the *current* handler at the time the event fires, not the one that existed when the listener was attached.

**Batching.** In [Part 7](/blog/react-internals-7-state-updates-and-lanes), we'll see how React batches multiple `setState` calls into one render. This works because React controls when event handlers execute, wrapping them in a context that enables batching. With native listeners, React wouldn't have that control.

**Performance at scale.** A complex app might have thousands of interactive elements. Instead of thousands of individual listeners (each consuming memory, each needing cleanup), React has one. The delegation pattern is more memory-efficient and avoids the cost of attaching/detaching listeners as components mount and unmount.

---

## How event delegation works

Here's the full picture of what happens when you click a button in a React app:

1. The browser fires a native click event on the `<button>` DOM node.
2. The event bubbles up through the DOM, past `<div>`s and past `<main>`, until it reaches your app's root node.
3. React's single listener catches it there.
4. React looks up which fiber (component) owns that `<button>`.
5. React walks *up the fiber tree* from that fiber, collecting every `onClick` handler along the way.
6. React wraps the native event in a synthetic event and calls your handlers in order.

The thing that surprises people: step 5 walks the **fiber tree**, not the DOM tree. We'll see why that matters in a moment.

Here's what the code looks like (simplified):

```js
// Simplified from ReactDOMEventListener.js
function dispatchEvent(nativeEvent) {
  const targetFiber = getClosestFiberFromDOM(nativeEvent.target);
  const listeners = collectListeners(targetFiber, nativeEvent.type);
  const syntheticEvent = createSyntheticEvent(nativeEvent);

  for (const listener of listeners) {
    listener(syntheticEvent);
    if (syntheticEvent.isPropagationStopped()) break;
  }
}
```

---

## From DOM node to fiber

Step 4 from above, "React looks up which fiber owns that button", raises an obvious question. How?

Every time React puts a DOM node on the page, it quietly stashes a back-reference on it: `domNode.__reactFiber$ = fiber`. It's a hidden property you've probably never noticed. When an event arrives, React reads it off `nativeEvent.target` to find the target fiber. If the exact node isn't React-managed (say, a text node inside a `<span>`), React walks up the DOM parents until it finds one that is.

From there, React walks the `return` pointers (each fiber's parent) up the fiber tree, collecting every `onClick`, `onClickCapture`, etc. registered along the path. This simulates event propagation, but through the *fiber tree* rather than the DOM tree.

Why does that distinction matter?

---

## Why fiber propagation matters

Because the fiber tree and the DOM tree aren't always the same shape. **Portals** are the clearest example:

```jsx
function Modal({ children }) {
  return createPortal(children, document.getElementById('modal-root'));
}

function App() {
  return (
    <div onClick={() => console.log('caught!')}>
      <Modal>
        <button>Click me</button>
      </Modal>
    </div>
  );
}
```

In the DOM, the button lives inside `#modal-root`, completely outside the `<div>`. A native event listener on the `<div>` would never see the click. But in React, the click *does* bubble to the `<div>`'s `onClick` handler, because React propagates through the fiber tree, and in the fiber tree the `Modal` is a child of the `<div>`.

This is by design. Event bubbling follows the *component* hierarchy, which is your mental model, rather than the *DOM* hierarchy, which is an implementation detail. But it surprises developers who mix React and native event listeners.

---

## Synthetic events

The `e` you get in your event handler isn't the browser's native event object. It's a **synthetic event**, built by `createSyntheticEvent` in [`SyntheticEvent.js`](https://github.com/facebook/react/blob/v19.2.8/packages/react-dom-bindings/src/events/SyntheticEvent.js). It's a React wrapper that looks and behaves like a native event but is controlled by React.

For the most part, you'll never notice the difference. `e.target`, `e.preventDefault()`, `e.stopPropagation()` all work as expected. But there are a couple of things worth knowing:

- **`e.stopPropagation()`** stops propagation through React's *fiber-based* traversal *and* calls the native `stopPropagation`. It works in both worlds.
- **`e.nativeEvent`** gives you the original browser event, if you ever need it (rare, but useful for interop with non-React code).
- **`e.currentTarget` becomes `null` after the handler finishes.** React sets it while walking the fiber tree and clears it after. If you try to read it in a `setTimeout` or `await`, it's gone. This has tripped up everyone at least once.

Why bother with a wrapper? Historically, it was for cross-browser normalization. Today it's mostly about integration. The synthetic event is how React ties the event system to the fiber tree and the priority model.

---

## onChange, the event React invented

Here's a fun one. In native HTML, the `change` event on an `<input>` fires when the element loses focus, not on every keystroke. If you want real-time updates, you use the `input` event.

React's `onChange` is different. It fires on every keystroke, every paste, every input change, in real time. It's actually wired to the native `input` event (and a few others), not the native `change` event:

```jsx
// When you write this:
<input onChange={handleChange} />

// React listens for these native events:
// - input
// - change (for checkboxes, selects, and some edge cases)
// - click (for checkboxes)
```

React chose to do this because the native `change` behavior (fire on blur) was almost never what developers wanted. By mapping `onChange` to `input`, React made the common case the default, at the cost of diverging from the HTML spec.

This is why developers who are used to native events are sometimes surprised that React's `onChange` is "too eager." It's not the same event. It's React's own abstraction, designed for how UI development actually works rather than how the DOM spec was written.

---

## Event priorities and lanes

Here's something you've experienced but probably never thought about: `setState` inside an `onClick` feels instant, but `setState` inside a `mousemove` can feel slightly laggy. That's not your imagination. React is treating them differently on purpose.

Before React even calls your handler, it tags the event with a priority. That priority determines which **lane** (from [Part 7](/blog/react-internals-7-state-updates-and-lanes)) any `setState` calls inside the handler will receive:

| Event type | Priority | Lane |
| --- | --- | --- |
| `click`, `keydown`, `input`, `change` | Discrete | `SyncLane` |
| `mousemove`, `scroll`, `pointermove` | Continuous | `InputContinuousLane` |
| Everything else | Default | `DefaultLane` |

A click is a deliberate action, and the user expects an immediate response. A mouse movement fires dozens of times per second, so React can afford to batch those. The event system is making this priority decision *before your handler even runs*, so the right lane is already set when you call `setState`.

---

## The gotcha: React events vs native events

This layered event system creates a common gotcha when you mix React and native listeners:

```jsx
function App() {
  const ref = useRef(null);

  useEffect(() => {
    // Native listener, runs during browser propagation
    ref.current.addEventListener('click', (e) => {
      console.log('native');
      e.stopPropagation(); // stops browser propagation
    });
  }, []);

  return (
    <div onClick={() => console.log('react parent')}>
      <button ref={ref} onClick={() => console.log('react button')}>
        Click
      </button>
    </div>
  );
}
```

What happens when you click the button? It depends on the React version, the event type, and whether React used capture or bubble phase for its root listener. The exact ordering is hard to predict, and that's the point.

The rule of thumb: **don't mix React event handlers and native `addEventListener` on the same element.** The two systems have different propagation models, and combining them leads to "works on my machine" bugs that break on the next React update.

If you must use a native listener (for events React doesn't support, or for third-party library integration), attach it in a `useEffect`, clean it up in the return, and don't expect `stopPropagation` in one system to affect the other.

---

## The mental model, distilled

React's event system is a delegation layer. One listener at the root catches everything. When an event fires, React finds the target fiber, walks up the fiber tree collecting handlers, wraps the native event in a synthetic one, and calls your handlers in order.

This means:
- **Your handler isn't on the DOM node.** It's registered on the fiber and called by React's dispatch.
- **Propagation follows the fiber tree.** That matters for portals, where the fiber tree and DOM tree diverge.
- **`onChange` isn't the native `change` event.** It's React's abstraction over `input` and other events.
- **Event type determines lane priority.** Clicks get `SyncLane`, mousemove gets `InputContinuousLane`.

The event system is the front door to everything else in React. User interactions enter here, get transformed into state updates with the right priority, and flow into the rendering pipeline we've covered in Parts 1-3. In [Part 5](/blog/react-internals-5-fiber-tree), we'll see the fiber tree that makes all this propagation work, and why React needed a persistent tree structure instead of ephemeral element objects.

---

### React Internals: Under the Hood

1. [How Hooks Really Work](/blog/react-internals-1-how-hooks-work)
2. [useEffect Is Not a Lifecycle Method](/blog/react-internals-2-useeffect-is-not-a-lifecycle)
3. [From JSX to Pixels](/blog/react-internals-3-jsx-to-pixels)
4. **The Event System**
5. [The Fiber Tree](/blog/react-internals-5-fiber-tree)
6. [Reconciliation](/blog/react-internals-6-reconciliation)
7. [State Updates, Batching, and the Lane Model](/blog/react-internals-7-state-updates-and-lanes)
8. [Concurrent React](/blog/react-internals-8-concurrent-react)
