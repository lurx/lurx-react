# React Internals — Analogies

One anchor analogy per article. Used once to make the core concept intuitive, then dropped.

---

## Part 1: Hooks — The Notepad

Already in the article. React follows you around with a notepad, writing things down as you call hooks. On re-render, it flips back to page one and reads top to bottom. It doesn't know your variable names — it knows positions.

---

## Part 2: useEffect — The Thermostat

useEffect is like a thermostat, not an alarm clock. An alarm clock fires at a set time (lifecycle). A thermostat checks the temperature and only kicks in when something's off (synchronization). It doesn't care what time it is — it cares whether the room matches the target. When the temperature changes, it turns on. When it matches, it turns off. That's the create/destroy cycle.

---

## Part 3: JSX to Pixels — The Architect and the Construction Crew

Rendering is an architect drawing blueprints. Committing is the construction crew building from those blueprints. The architect can redraw ten times — that's cheap, it's just paper. The crew only shows up when the blueprint actually changes. And if the architect tears up a draft? No concrete was poured. Nothing to undo.

---

## Part 4: Event System — The Receptionist

Imagine a receptionist at a building entrance. Every visitor checks in at the front desk, and the receptionist looks up which floor and office they need. No individual office has a doorbell — the receptionist routes everyone. That's React's event system: one listener at the root, routing every event to the right handler. The receptionist also decides urgency — a delivery goes to the mailroom, but a fire alarm gets the whole building's attention (event priorities → lanes).

---

## Part 5: Fiber Tree — The Bookmark

The old React was like reading a book aloud — once you start a sentence, you have to finish it before anyone else can talk. Fiber is like reading with a bookmark. You can stop mid-page, help your kid with a question, and pick up exactly where you left off. The bookmark (workInProgress pointer) remembers your place. The book (fiber tree) doesn't lose its pages while you're away.

---

## Part 6: Reconciliation — The Teacher Taking Attendance

Reconciliation is like a teacher taking attendance. She doesn't compare every student to every other student — that would take forever. She calls names from the roster and checks: here, here, new kid, absent. Same name, same seat — just check if anything changed. New name? Find them a desk. Name missing? They left. And the key prop? That's the student's name tag. Get it wrong and the teacher thinks the new kid is actually Jake from last semester.

---

## Part 7: State Updates — The Waiter and the Hospital

Two analogies:

**Batching** is like a waiter taking orders from the whole table before going to the kitchen. Three people order at once? One trip. The waiter doesn't sprint to the kitchen after each "I'll have the pasta." They collect everything, then go.

**Lanes** are like hospital triage. Everyone gets treated — but the person with chest pain goes before the sprained ankle. A click (SyncLane) is chest pain. A transition (TransitionLane) is the sprained ankle. Both get attention, but in the right order.

---

## Part 8: Concurrent React — Cooking Dinner While Helping With Homework

Concurrent React is like cooking dinner while helping your kid with homework. You chop vegetables for a minute, check their math problem, chop some more, answer another question. You're not doing both at once — you're switching between them fast enough that both make progress. The key is being willing to put down the knife when something more important needs attention. And if you realize you were chopping the wrong vegetable? You just toss it — no dinner was served yet.
