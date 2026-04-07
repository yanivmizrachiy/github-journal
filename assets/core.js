function getTodayISO(){
  return new Date().toISOString().slice(0,10);
}
function loadJSON(date){
  return fetch(`./entries/${date}.json?ts=${Date.now()}`,{cache:"no-store"})
  .then(r=>r.ok?r.json():null).catch(()=>null);
}
function isShabbat(d){ return d.getDay()===6; }
async function getParasha(date){
  if(!isShabbat(date)) return "";
  try{
    const iso=date.toISOString().slice(0,10);
    const r=await fetch(`https://www.hebcal.com/shabbat?cfg=json&date=${iso}`);
    const j=await r.json();
    return j.parasha||"";
  }catch{return "";}
}
