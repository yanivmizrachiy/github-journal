async function buildSmartMonth(gridId){
  const grid=document.getElementById(gridId);
  if(!grid) return;

  const now=new Date();
  const year=now.getFullYear();
  const month=now.getMonth();

  const start=new Date(year,month,1);
  const daysInMonth=new Date(year,month+1,0).getDate();

  const hebcalRes=await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&month=${month+1}&maj=on&min=on&mod=on&nx=on`);
  const hebcal=await hebcalRes.json();

  let schoolVacations={};
  try{
    const schoolRes=await fetch('./assets/school-vacations.json?ts='+Date.now(), {cache:'no-store'});
    if(schoolRes.ok) schoolVacations=await schoolRes.json();
  }catch{}

  const map={};
  (hebcal.items||[]).forEach(item=>{
    const iso=item.date?.split('T')[0];
    if(!iso) return;
    map[iso]=map[iso]||[];
    map[iso].push(item);
  });

  grid.innerHTML='';

  for(let blank=0; blank<start.getDay(); blank++){
    const empty=document.createElement('div');
    empty.className='day';
    empty.style.visibility='hidden';
    grid.appendChild(empty);
  }

  for(let i=1;i<=daysInMonth;i++){
    const d=new Date(year,month,i);
    const iso=d.toISOString().slice(0,10);

    const div=document.createElement('div');
    div.className='day';

    const labels=[];

    if(d.getDay()===6){
      div.classList.add('shabbat');
    }

    const items=map[iso]||[];
    for(const ev of items){
      const title=(ev.title||'');
      const heb=(ev.hebrew||'');

      if(title.includes('Parashat') || title.includes('Shabbat')){
        if(heb) labels.push(heb);
      }

      if(ev.category==='roshchodesh'){
        div.classList.add('rosh');
        if(heb) labels.push(heb);
      }

      if(ev.category==='holiday'){
        div.classList.add('holiday');
        if(heb) labels.push(heb);
      }
    }

    if(schoolVacations[iso]){
      div.classList.add('school');
      labels.push(schoolVacations[iso]);
    }

    const uniq=[...new Set(labels.filter(Boolean))];

    div.innerHTML = `
      <div class="num">${i}</div>
      ${uniq.map(x=>`<div class="label">${x}</div>`).join('')}
    `;

    grid.appendChild(div);
  }
}
