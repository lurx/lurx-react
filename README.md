# rotem.is-a.dev

Personal portfolio website built with Next.js, React, and GSAP in an Nx monorepo.

## Design

Design is [Developer portfolio concept](https://www.figma.com/design/6uYS9Jfst5FROmiwrJnkd7/Portfolio-for-Developers-Concept-V.2.1--Community-?node-id=72-1508&p=f&m=dev) By [Yanka Darelova](https://www.darelova.com/).

## Tech Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** SCSS Modules with CSS custom properties
- **Animations:** GSAP timelines, scroll-triggered effects, `prefers-reduced-motion` support
- **Content:** Velite for blog posts, Shiki for syntax highlighting
- **Monorepo:** Nx with pnpm
- **Testing:** Jest + React Testing Library, Playwright for E2E

## Project Structure

```
apps/
  rotem-is-a-dev/       Main portfolio application
  rotem-is-a-dev-e2e/   Playwright E2E tests
  wolverine-css/        CSS art experiment
```

## Development

```sh
# Install dependencies
pnpm install

# Start dev server (port 4200)
pnpm nx serve rotem-is-a-dev

# Build for production
pnpm nx build rotem-is-a-dev

# Run tests
pnpm nx test rotem-is-a-dev

# Lint
pnpm nx lint rotem-is-a-dev
```

## License

All rights reserved. Source code is available for viewing and reference only. See [LICENSE](./LICENSE).
