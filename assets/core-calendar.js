async function loadAll(){
  const school = await fetch('./assets/school-vacations.json?ts='+Date.now()).then(r=>r.json()).catch(()=>({}));
  return {school};
}

function iso(d){ return d.toISOString().slice(0,10); }

function isFriSat(d){
  const x=d.getDay();
  return x===5 || x===6;
}

async function parasha(d){
  try{
    const r=await fetch(`https://www.hebcal.com/shabbat?cfg=json&date=${iso(d)}`,{cache:'no-store'});
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

function applyColors(el,d,school){
  const i=iso(d);
  const vacation = !!school[i];
  const frisat = isFriSat(d);

  if(vacation && frisat){
    el.style.background = 'linear-gradient(135deg,#22c55e 0 50%,#ec4899 50% 100%)';
    el.style.color = '#000';
    return;
  }

  if(vacation){
    el.style.background = '#22c55e';
    el.style.color = '#000';
    return;
  }

  if(frisat){
    el.style.background = '#ec4899';
    el.style.color = '#000';
    return;
  }
}

async function getDayLabels(d, school){
  const labels = [];
  const i = iso(d);

  if(school[i]) labels.push(school[i]);

  try{
    const r = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&start=${i}&end=${i}&maj=on&min=on&mod=on&nx=on`, {cache:'no-store'});
    const j = await r.json();
    for(const ev of (j.items||[])){
      const heb = ev.hebrew || "";
      const title = ev.title || "";
      if(ev.category === "roshchodesh" && heb) labels.push(heb);
      if(ev.category === "holiday" && heb) labels.push(heb);
      if(title.includes("Parashat") && heb) labels.push(heb);
    }
  }catch{}

  if(isFriSat(d)){
    const p = await parasha(d);
    if(p) labels.push(p);
  }

  return [...new Set(labels.filter(Boolean))];
}
