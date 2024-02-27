export const getWeekDay = (date: Date) => {
  const WEEKDAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  return WEEKDAY[date.getDay()]
}
