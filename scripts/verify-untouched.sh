#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git rev-parse --verify refs/tags/baseline-untouched >/dev/null
git diff --exit-code baseline-untouched -- hackshift/projects/
new_files=$(git ls-files --others --exclude-standard -- hackshift/projects/)
if [[ -n "$new_files" ]]; then
  echo "Unexpected original-project files: $new_files" >&2
  exit 1
fi
echo 'PASS: original projects match baseline-untouched (no source exceptions)'
