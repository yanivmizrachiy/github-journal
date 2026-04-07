async function getParashaForDate(date){
  try{
    const iso=isoDate(date);
    const r=await fetch(`https://www.hebcal.com/shabbat?cfg=json&date=${iso}`,{cache:'no-store'});
    if(!r.ok) return "";
    const j=await r.json();
    if(j.parasha) return j.parasha;
    if(Array.isArray(j.items)){
      const p=j.items.find(x => (x.title||"").includes("Parashat"));
      return p ? (p.hebrew || p.title || "") : "";
    }
    return "";
  }catch{
    return "";
  }
}

async function getHebcalMonthMap(year, month){
  try{
    const r=await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&month=${month+1}&maj=on&min=on&mod=on&nx=on`,{cache:'no-store'});
    const j=await r.json();
    const map={};
    (j.items||[]).forEach(item=>{
      const iso=item.date?.split("T")[0];
      if(!iso) return;
      map[iso]=map[iso]||[];
      map[iso].push(item);
    });
    return map;
  }catch{
    return {};
  }
}

function getLabelsForDate(iso, hebcalMap, schoolVacations, parashaText){
  const labels=[];

  const items=hebcalMap[iso]||[];
  for(const ev of items){
    const heb=ev.hebrew||"";
    if(ev.category==="roshchodesh" && heb) labels.push(heb);
    if(ev.category==="holiday" && heb) labels.push(heb);
  }

  if(schoolVacations[iso]) labels.push(schoolVacations[iso]);
  if(parashaText) labels.push(parashaText);

  return [...new Set(labels.filter(Boolean))];
}

function getClassesForDate(date, iso, hebcalMap, schoolVacations){
  const classes=[];
  if(isFridayOrSaturday(date)) classes.push("shabbat");
  const items=hebcalMap[iso]||[];
  if(items.some(ev=>ev.category==="roshchodesh")) classes.push("rosh");
  if(items.some(ev=>ev.category==="holiday")) classes.push("holiday");
  if(schoolVacations[iso]) classes.push("school");
  return classes;
}
