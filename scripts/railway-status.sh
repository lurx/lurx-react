#!/usr/bin/env sh
# Run Railway CLI from the story-wise-processor root (where railway link lives).
# Use this when the Cursor agent can't reach the network: run it in your
# Cursor terminal, then the agent can read the output from the terminals folder.
# Requires: railway CLI, and `railway link` from apps/story-wise-processor.

set -e

cd "$(dirname "$0")/../apps/story-wise-processor"

echo "==> railway whoami"
railway whoami || true
echo ""
echo "==> railway status"
railway status || true
echo ""
echo "==> railway service status --all"
railway service status --all || true
