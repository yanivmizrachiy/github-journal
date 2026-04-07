#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "${1:-$HOME/github-journal}"
mkdir -p STATE
OUT="STATE/DOCTOR.md"
fail=0

echo "# DOCTOR REPORT" > "$OUT"
echo >> "$OUT"

check_file(){ [ -f "$1" ] && echo "- $1: OK" >> "$OUT" || { echo "- $1: FAIL" >> "$OUT"; fail=1; }; }
check_grep(){ grep -q "$2" "$1" 2>/dev/null && echo "- $3: OK" >> "$OUT" || { echo "- $3: FAIL" >> "$OUT"; fail=1; }; }

check_file "index.html"
check_file "history.html"
check_file "month.html"
check_file "editor.html"
check_file "assets/styles.css"
check_file "assets/core-calendar.js"
check_file "assets/school-vacations.json"

check_grep "index.html" 'id="day"' "daily day element"
check_grep "index.html" 'id="greg"' "daily gregorian element"
check_grep "index.html" 'id="heb"' "daily hebrew element"
check_grep "index.html" 'id="events"' "daily events element"
check_grep "index.html" 'id="notes"' "daily notes element"
check_grep "history.html" 'assets/core-calendar.js' "weekly uses unified core"
check_grep "month.html" 'assets/core-calendar.js' "monthly uses unified core"
check_grep "assets/core-calendar.js" 'isFridayOrSaturday' "friday saturday logic"
check_grep "assets/core-calendar.js" 'schoolVacations' "school vacations logic"
check_grep "assets/core-calendar.js" 'getParashaForDate' "parasha logic"

if grep -q 'פתח עורך יומן\|היסטוריית ימים\|פתח קובץ היום\|הגדרות' index.html 2>/dev/null; then
  echo "- homepage unwanted old buttons: FAIL" >> "$OUT"
  fail=1
else
  echo "- homepage unwanted old buttons: OK" >> "$OUT"
fi

echo >> "$OUT"
[ "$fail" -eq 0 ] && echo "SYSTEM_STATUS=OK" >> "$OUT" || echo "SYSTEM_STATUS=FAIL" >> "$OUT"
cat "$OUT"
