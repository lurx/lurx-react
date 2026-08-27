---
title: "The Do's and Don'ts of Clean, Reusable React JSX"
slug: clean-jsx
date: 2025-02-27
description: "Golden rules for writing JSX that's clean, maintainable, and pleasing to your fellow developers."
tags: [react, jsx, best-practices]
draft: false
---
JSX is React's bread and butter. A sweet syntax layer that makes UI code read like the thing it renders. And like butter, spread it wrong and everything gets greasy.

Here are the rules I hold myself to, mostly so future-me at 2 AM doesn't have to untangle present-me's cleverness.

---

## Do keep JSX declarative

React wants to tell a story. Let it read like one.

```tsx
<Button
  onClick={handleClick}
  disabled={isLoading}
>
 {buttonLabel}
</Button>
```

Avoid logic gymnastics in the middle of your JSX.

```tsx
// ❌ Bad
<Button onClick={() => isValid && submitForm()}>
	{someFlag ? (otherFlag ? 'Yes' : 'Maybe') : 'No'}
</Button>
```

Better:

```tsx
const buttonLabel = getButtonLabel(someFlag, otherFlag);

const handleClick = () => {
	if (isValid) {
		submitForm();
	}
};

<Button onClick={handleClick}>{buttonLabel}</Button>;
```

Rule of thumb: if your JSX looks like a puzzle, pull the logic out and give it a name.

---

## Don't use ternaries in JSX

Yes, ternaries are concise. Yes, they make you feel clever. But no, they're not readable at scale.

```tsx
// ❌ Nope
<div>
	{user.isAdmin ? (user.isSuperAdmin ? 'Super Admin' : 'Admin') : 'User'}
</div>
```

Clean it up:

```tsx
const roleLabel = getRoleLabel(user);

<div>{roleLabel}</div>;
```

Let your JSX breathe. Logic belongs in variables, hooks, or helper functions.

---

## Do extract inline functions

Every time you define a function in JSX, React re-creates it on every render. This can break `useMemo`, `React.memo`, and your soul.

```tsx
// ❌ Bad
<MyComponent onClick={() => doSomething(item.id)} />
```

```tsx
// ✅ Better
const handleClick = () => doSomething(item.id);

<MyComponent onClick={handleClick} />;
```

Or if needed:

```tsx
const handleClick = useCallback(() => {
	doSomething(item.id);
}, [item.id]);
```

A named handler also tells the next reader what the click does before they open the callback.

---

## Don't use magic values in JSX

Magic values are fine in fairy tales, but not in your markup.

```tsx
<header style={{ marginTop: 37 }}>Hello</header>
```

```tsx
// ✅ Good
const HEADER_MARGIN = 37;

const headerStyle = {
	marginTop: HEADER_MARGIN,
};

<header style={headerStyle}>Hello</header>;
```

When the design system moves that 37 to 40, you change one line instead of grepping for the number.

---

## Do break complex JSX into components

If your JSX block is starting to look like it belongs in the Louvre... extract it!

```tsx
// ❌ Instead of this:
items.map(item => {
  const handleBuy = () => buyItem(item.id);
  return (
    <div key={item.id}>
      <h3>{item.title}</h3>
			<p>{item.description}</p>
			<Button onClick={handleBuy}>Buy</Button>
		</div>
	);
});
```

```tsx
// ✅ Break it down:
items.map(item => (
	<StoreItem
		key={item.id}
		item={item}
		onBuy={buyItem}
	/>
));
```

Now the card markup has one home, and the map body is a single component call.

---

## Don't nest JSX like it's Inception

Fragments are great. But double-nesting them, triple-nesting them, nesting `<div>`s like Russian dolls? Not great.

```tsx
// ❌ Over-nested
<>
	<div>
		<section>
			<div>
				<ul>
					<li>
						<a href="#">Help</a>
					</li>
				</ul>
			</div>
		</section>
	</div>
</>
```

Use semantic tags, and extract a component once the indentation passes four levels.

---

## Do name things meaningfully

You're writing for Karen from QA, and for Dave six months from now.

```tsx
// ❌ Confusing
<Thing stuff={value} onDo={handleIt} />

// ✅ Clear
<UserCard user={user} onEdit={handleEditUser} />
```

JSX is not the place for riddles. Save that for your escape room hobby.

---

## Don't spread props blindly

```tsx
// ❌ What horrors lie within this {...props}?
<MyComponent {...props} />
```

Instead, be explicit:

```tsx
<MyComponent
	title={title}
	onClick={handleClick}
/>
```

Clarity beats convenience, every time.

> Spreading hides what a component actually receives, and it forwards props the child never asked for. The exception is a pass-through wrapper or an HOC, where forwarding everything is the entire job.

---

## Do use a stable, unique `key` per `.map()`

React uses the `key` prop to track items inside a list. It has to be unique within that one `.map()`, not across your whole app.

```tsx
// ❌ Bad. Index breaks when the list changes
items.map((item, index) => (
	<ListItem
		key={index}
		item={item}
	/>
));
```

```tsx
// ✅ Good. Stable and unique within this map
items.map(item => (
	<ListItem
		key={item.id}
		item={item}
	/>
));
```

Index keys are safe only for a list that never reorders, filters, or grows. Everything else needs an id.

---

## Wrap-up

The short version.

- **Keep it declarative.** Logic before render.
- **Extract everything.** Ternaries, inline functions, magic numbers.
- **Name wisely.** Clarity beats cleverness.
- **Componentize like a boss.** Even the small chunks.
- **Use proper keys.** Unique per map, stable per item.
- **Never write JSX you wouldn't want to debug with a hangover.**

React rewards restraint. Write JSX you'd be happy to read out loud.
