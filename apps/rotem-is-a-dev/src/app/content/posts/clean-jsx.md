# 🧼 The Do’s and Don’ts of Clean, Reusable React JSX

JSX is React’s bread and butter—a sweet syntax layer that makes our UI code feel intuitive and expressive. But just like butter, if you overdo it or spread it wrong, things get messy.

This guide outlines the golden rules for writing JSX that’s clean, maintainable, and pleasing to your fellow developers (and future-you at 2 AM).

---

## ✅ DO: Keep JSX Declarative and Clean

React wants to tell a story. Let it read like a story.

```tsx
<Button
	onClick={handleClick}
	disabled={isLoading}
>
	{buttonLabel}
</Button>
```

But avoid logic gymnastics right in the middle of your JSX:

```tsx
// ❌ Bad
<Button onClick={() => isValid && submitForm()}>
	{someFlag ? (otherFlag ? 'Yes' : 'Maybe') : 'No'}
</Button>
```

✅ Better

```tsx
const buttonLabel = getButtonLabel(someFlag, otherFlag);

const handleClick = () => {
	if (isValid) {
		submitForm();
	}
};

<Button onClick={handleClick}>{buttonLabel}</Button>;
```

_**Rule of thumb**_: If your JSX looks like a puzzle, pull the logic out and name it something readable.

---

## ❌ DON'T: Use Ternaries in JSX (for anything)

Yes, ternaries are concise. Yes, they make you feel clever. But no, they're not readable at scale.

```tsx
// ❌ Nope
<div>
	{user.isAdmin ? (user.isSuperAdmin ? 'Super Admin' : 'Admin') : 'User'}
</div>
```

✅ Clean it up

```tsx
const roleLabel = getRoleLabel(user);

<div>{roleLabel}</div>;
```

Let your JSX breathe. Logic belongs in variables, hooks, or helper functions.

---

## ✅ DO: Extract Inline Functions to Constants or useCallback

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

It’s like inviting a friend to dinner: give them a name, don’t make them show up anonymous.

---

## ❌ DON'T: Use Magic Values in JSX

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

Named constants speak volumes. And when the design system changes? You’ll thank yourself.

---

## ✅ DO: Break Down Complex JSX into Components

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

Cleaner code. Reusable components. Fewer bugs. Happier devs.

---

## ❌ DON'T: Nest JSX Like It’s Inception

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

✅ Simplify layout. Use semantic tags. Extract structure where it gets gnarly.

---

## ✅ DO: Use Meaningful, Consistent Naming

You’re not just writing for yourself. You’re writing for Karen from QA and Dev Dave from the future.

```tsx
// ❌ Confusing
<Thing stuff={value} onDo={handleIt} />

// ✅ Clear
<UserCard user={user} onEdit={handleEditUser} />
```

JSX is not the place for riddles. Save that for your escape room hobby.

---

## ❌ DON'T: Spread Props Blindly

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

Clarity > Convenience. Always.

> Prop spreading is generally discouraged as it can lead to unintended behavior or make the code harder to understand. However, it is acceptable in cases where all props need to be passed down to a child component or when working with higher-order components (HOCs) or utility wrappers.

---

## ❌ DON'T: Use Duplicate or Unstable Keys

## ✅ DO: Use a Unique `key` per `.map()`

React uses the `key` prop to track items inside a list. It does **not** need to be globally unique — only unique within that specific `.map()`.

```tsx
// ❌ Bad – index can break if the list changes
items.map((item, index) => (
	<ListItem
		key={index}
		item={item}
	/>
));
```

```tsx
// ✅ Good – stable and unique within this map
items.map(item => (
	<ListItem
		key={item.id}
		item={item}
	/>
));
```

Avoid using `index` unless your list is completely static and never changes. Keys should be predictable, stable, and unique within the list they belong to.

---

# Wrap-Up: JSX Zen Mode

Here’s your JSX mantra:

- **Keep it declarative** — logic before render.
- **Extract everything** — ternaries, inline functions, magic numbers.
- **Name wisely** — clarity beats cleverness.
- **Componentize like a boss** — even small chunks.
- **Use proper keys** — unique per map, stable per item.
- **Never write JSX you wouldn’t want to debug with a hangover.**

React rewards the developer who shows restraint. So write JSX like it’s poetry — with purpose, clarity, and not a ternary in sight.
