#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "${1:-$HOME/github-journal}"
DOC="STATE/DOCTOR.md"
[ -f "$DOC" ] || { echo "Missing $DOC"; exit 1; }
STATUS="$(grep 'SYSTEM_STATUS=' "$DOC" | tail -n1 | cut -d= -f2)"
{
  echo "# RULES — SOURCE OF TRUTH (REAL)"
  echo
  echo "## דרישות המשתמש"
  echo "- דף יומי: יום גדול + תאריך עברי + תאריך לועזי + תוכן היום"
  echo "- תצוגה יומית / שבועית / חודשית"
  echo "- שמירת נתונים אמיתית"
  echo "- ימי שישי ושבת בוורוד עם פרשת השבוע"
  echo "- ראש חודש בצהוב"
  echo "- חופשות מוסדות לימוד בירוק"
  echo "- בלי סתירות ב-RULES"
  echo
  echo "## מה נבדק בפועל"
  grep '^- ' "$DOC" || true
  echo
  echo "## סטטוס מערכת"
  echo "- doctor: ${STATUS}"
  echo
  echo "## פירוש הסטטוס"
  echo "- OK = קיים ונמצא בקוד"
  echo "- FAIL = חסר או לא נמצא בקוד"
  echo "- אימות חזותי בטלפון עדיין דורש בדיקה ידנית"
} > RULES.md
cat RULES.md
