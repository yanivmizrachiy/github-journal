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
    const r=await fetch(`https://www.hebcal.com/shabbat?cfg=json&date=${iso(d)}`);
    const j=await r.json();
    return j.parasha || "";
  }catch{return "";}
}

function applyColors(el,d,school){
  const i=iso(d);

  // 🔥 עדיפות מוחלטת לחופשה
  if(school[i]){
    el.style.background = '#22c55e';
    el.style.color = '#000';
    return;
  }

  // רק אם לא חופשה
  if(isFriSat(d)){
    el.style.background = '#ec4899';
    el.style.color = '#000';
  }
}
