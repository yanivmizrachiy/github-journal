async function getParasha(date){
  try{
    const res = await fetch("https://www.hebcal.com/shabbat?cfg=json");
    const data = await res.json();
    return data.parasha || "";
  }catch{
    return "";
  }
}

function isShabbat(date){
  return date.getDay() === 6;
}
