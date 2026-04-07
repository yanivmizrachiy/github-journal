async function loadSchoolVacations(){
  try{
    const r=await fetch('./assets/school-vacations.json?ts='+Date.now(),{cache:'no-store'});
    return r.ok ? await r.json() : {};
  }catch{
    return {};
  }
}

function isFridayOrSaturday(d){
  const day=d.getDay();
  return day===5 || day===6;
}

function isoDate(d){
  return d.toISOString().slice(0,10);
}
