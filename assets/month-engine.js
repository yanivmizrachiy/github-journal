async function buildSmartMonth(gridId){
  const grid=document.getElementById(gridId);
  if(!grid) return;

  const now=new Date();
  const year=now.getFullYear();
  const month=now.getMonth();

  const start=new Date(year,month,1);
  const daysInMonth=new Date(year,month+1,0).getDate();

  const res=await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&month=${month+1}&maj=on&min=on&mod=on&nx=on`);
  const data=await res.json();

  let schoolVacations={};
  try{
    const r=await fetch('./assets/school-vacations.json?ts='+Date.now(),{cache:'no-store'});
    if(r.ok) schoolVacations=await r.json();
  }catch{}

  const map={};
  (data.items||[]).forEach(item=>{
    const iso=item.date?.split('T')[0];
    if(!iso) return;
    map[iso]=map[iso]||[];
    map[iso].push(item);
  });

  grid.innerHTML='';

  // רווחים בתחילת החודש
  for(let i=0;i<start.getDay();i++){
    const e=document.createElement('div');
    e.className='day';
    e.style.visibility='hidden';
    grid.appendChild(e);
  }

  for(let i=1;i<=daysInMonth;i++){
    const d=new Date(year,month,i);
    const iso=d.toISOString().slice(0,10);

    const div=document.createElement('div');
    div.className='day';

    const labels=[];

    // שבת
    if(d.getDay()===6){
      div.classList.add('shabbat');
    }

    const items=map[iso]||[];

    for(const ev of items){
      const title=ev.title||"";
      const heb=ev.hebrew||"";

      // פרשת שבוע — תיקון יציב
      if(title.includes("Parashat") && heb){
        labels.push(heb);
      }

      // ראש חודש
      if(ev.category==="roshchodesh"){
        div.classList.add('rosh');
        if(heb) labels.push(heb);
      }

      // חגים
      if(ev.category==="holiday"){
        div.classList.add('holiday');
        if(heb) labels.push(heb);
      }
    }

    // חופשות בית ספר
    if(schoolVacations[iso]){
      div.classList.add('school');
      labels.push(schoolVacations[iso]);
    }

    const uniq=[...new Set(labels)];

    div.innerHTML = `
      <div class="num">${i}</div>
      ${uniq.map(x=>`<div class="label">${x}</div>`).join("")}
    `;

    grid.appendChild(div);
  }
}
