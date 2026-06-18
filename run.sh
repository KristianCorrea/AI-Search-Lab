#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if command -v bun &>/dev/null; then
  bun install
  bun run dev
else
  npm install
  npm run dev
fi
