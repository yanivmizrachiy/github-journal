function getSchoolEvents(date){
  const d=date.toISOString().slice(5,10);

  const vacations={
    "09-01":"חזרה ללימודים",
    "10-10":"חופשת סוכות",
    "12-20":"חופשת חנוכה",
    "04-10":"חופשת פסח",
    "06-20":"חופש גדול"
  };

  return vacations[d] || null;
}
