async function loadSchoolVacations(){
  try{
    const r=await fetch('./assets/school-vacations.json?ts='+Date.now(),{cache:'no-store'});
    return r.ok ? await r.json() : {};
  }catch{
    return {};
  }
}

function isoDate(d){ return d.toISOString().slice(0,10); }

function isFriday(d){ return d.getDay()===5; }
function isSaturday(d){ return d.getDay()===6; }
function isFridayOrSaturday(d){ return isFriday(d) || isSaturday(d); }

async function getParashaForDate(d){
  try{
    const r=await fetch(`https://www.hebcal.com/shabbat?cfg=json&date=${isoDate(d)}`,{cache:'no-store'});
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

async function getHebcalDayMap(startIso,endIso){
  try{
    const r=await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&start=${startIso}&end=${endIso}&maj=on&min=on&mod=on&nx=on`,{cache:'no-store'});
    if(!r.ok) return {};
    const j=await r.json();
    const map={};
    (j.items||[]).forEach(item=>{
      const iso=item.date?.split('T')[0];
      if(!iso) return;
      map[iso]=map[iso]||[];
      map[iso].push(item);
    });
    return map;
  }catch{
    return {};
  }
}

function getDayClasses(d,iso,schoolVacations,items){
  const classes=[];
  if(schoolVacations[iso]) classes.push('school');
  if(isFridayOrSaturday(d)) classes.push('shabbat');
  if((items||[]).some(ev=>ev.category==="roshchodesh")) classes.push('rosh');
  if((items||[]).some(ev=>ev.category==="holiday")) classes.push('holiday');
  return classes;
}

async function getDayLabels(d,iso,schoolVacations,items){
  const labels=[];
  if(schoolVacations[iso]) labels.push(schoolVacations[iso]);

  for(const ev of (items||[])){
    const heb=ev.hebrew||"";
    const title=ev.title||"";
    if(ev.category==="roshchodesh" && heb) labels.push(heb);
    if(ev.category==="holiday" && heb) labels.push(heb);
    if(title.includes("Parashat") && heb) labels.push(heb);
  }

  if(isFridayOrSaturday(d)){
    const p=await getParashaForDate(d);
    if(p) labels.push(p);
  }

  return [...new Set(labels.filter(Boolean))];
}

function applyDayClasses(el, classes){
  el.className = (el.className.split(/\s+/).filter(x=>x && !['school','shabbat','rosh','holiday'].includes(x)).join(' ') + ' ' + classes.join(' ')).trim();
}
