#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "${1:-$HOME/github-journal}"

echo "=== REPO ==="
pwd
git status --short || true
echo

if [ -x scripts/doctor.sh ]; then
  echo "=== DOCTOR ==="
  ./scripts/doctor.sh .
  echo
fi

if [ -x scripts/sync-rules.sh ]; then
  echo "=== SYNC RULES ==="
  ./scripts/sync-rules.sh .
  echo
fi

echo "=== GIT STATUS AFTER CHECKS ==="
git status --short || true
echo

if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "${2:-agent: sync doctor rules and repo state}" || true
  git push origin main
  echo
  echo "=== PUSHED ==="
else
  echo "=== NO CHANGES ==="
fi

echo
echo "=== LAST COMMITS ==="
git log --oneline -3
