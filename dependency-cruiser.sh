#!/bin/bash
set -euo pipefail

mkdir -p graphs
FILTERS=(--config .dependency-cruiser.js --include-only "^src" --exclude "^src/(shared)/|[.]test[.]tsx?$")

# 1. High-level architecture: one node per folder directly under src/
npx depcruise src "${FILTERS[@]}" --output-type archi \
  | node render-dot.mjs > graphs/architecture.svg

wait_batch() {
  local failed=0 pid

  for pid in "$@"; do
    wait "$pid" || failed=1
  done

  return "$failed"
}

# 2. One graph per folder: render up to five folders at once
pids=()
for dir in src/*/; do
  name=$(basename "$dir")
  [ "$name" = "shared" ] && continue

  (
    npx depcruise src "${FILTERS[@]}" \
      --focus "^src/$name/" \
      --collapse "^src/(?!$name/)[^/]+" \
      --output-type dot \
      | node render-dot.mjs > "graphs/folder-$name.svg"
  ) &

  pids+=("$!")

  if ((${#pids[@]} == 5)); then
    wait_batch "${pids[@]}"
    pids=()
  fi
done

# Wait for the final batch if fewer than five jobs remain
if ((${#pids[@]})); then
  wait_batch "${pids[@]}"
fi

# 3. Full implementation: every module under src
npx depcruise src "${FILTERS[@]}" --output-type dot \
  | node render-dot.mjs > graphs/full.svg