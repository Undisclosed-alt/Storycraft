#!/bin/bash
set -e

# Install pnpm if missing
if ! command -v pnpm >/dev/null; then
  npm install -g pnpm
fi

pnpm install
pnpm build
