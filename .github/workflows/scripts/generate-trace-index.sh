#!/bin/sh
set -e

TRACES_SRC="traces-all"
TRACES_OUT="gh-pages-out/traces"
BASE_URL="https://szymonpirecki.github.io/ecommerce-playwright-ts/traces"
VIEWER_URL="https://trace.playwright.dev/?trace="

mkdir -p "$TRACES_OUT"

if ! find "$TRACES_SRC" -name "trace.zip" 2>/dev/null | grep -q .; then
  cat > "$TRACES_OUT/index.html" << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Traces</title></head>
<body><p>No traces recorded — all tests passed on first attempt.</p></body>
</html>
HTML
  exit 0
fi

for dir in "$TRACES_SRC"/traces-*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir" | sed 's/^traces-//')
  cp -r "$dir" "$TRACES_OUT/$name"
done

{
  cat << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Playwright Traces</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; max-width: 800px; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    a { display: block; margin: 0.25rem 0; }
  </style>
</head>
<body>
<h1>Playwright Traces</h1>
HTML

  find "$TRACES_OUT" -name "trace.zip" | sort | while read -r f; do
    rel="${f#gh-pages-out/}"
    label="${rel#traces/}"
    echo "<a href=\"${VIEWER_URL}${BASE_URL}/${rel}\">${label}</a>"
  done

  echo "</body></html>"
} > "$TRACES_OUT/index.html"