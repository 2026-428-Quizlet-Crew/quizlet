#!/bin/bash
mkdir -p graphs
FILTERS=(--config .dependency-cruiser.js --include-only "^src" --exclude "^src/(shared)/|[.]test[.]tsx?$")

# 1. High-level architecture: one node per folder directly under src/
npx depcruise src "${FILTERS[@]}" --output-type archi \
  | dot -T svg > graphs/architecture.svg

# 2. One graph per folder: that folder in full, everything else collapsed
for dir in src/*/; do
  name=$(basename "$dir")
  [ "$name" = "shared" ] && continue   # excluded above
  npx depcruise src "${FILTERS[@]}" \
    --focus "^src/$name/" \
    --collapse "^src/(?!$name/)[^/]+" \
    --output-type dot \
    | dot -T svg > "graphs/folder-$name.svg"
done

# 3. Full implementation: every module under src
npx depcruise src "${FILTERS[@]}" --output-type dot \
  | dot -T svg > graphs/full.svg