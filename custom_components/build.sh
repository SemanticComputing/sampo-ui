#!/bin/bash
set -e

echo "Building all custom components..."

npm i

for dir in components/*/; do
  componentName=$(basename "$dir")
  echo "Building $componentName..."
  npx webpack --config "$dir/webpack.config.js" --mode production
done

echo "Done. Built files are in dist/"