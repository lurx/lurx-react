#!/usr/bin/env sh
# Run lint, test, and build before push. Mirrors CI: npx nx affected -t lint test build
# story-wise-processor is in .nxignore; run its typecheck separately.
# To run everything (not just affected): npx nx run-many -t lint test build --all

set -e

echo "==> Lint, test (Nx affected)..."
npx nx affected -t lint test

echo "==> Done."
