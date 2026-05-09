export function formatDate(dateInput: Date | string | number) {
  const days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now = new Date();
  const target = dateInput ? new Date(dateInput) : now;
  if (Number.isNaN(target.getTime())) {
    throw new Error("Invalid date supplied to 'formatDate()' function");
  }

  const getFullDaySpan = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const msPerDay = 24 * 60 * 60 * 1000;

  const diff = (getFullDaySpan(now) - getFullDaySpan(target)) / msPerDay;

  if (diff >= 0 && diff <= 6) {
    return `${days.at(target.getDay())} - ${target.getHours()}:${String(target.getMinutes()).padStart(2, "0")}`;
  }

  const day = String(target.getDate()).padStart(2, "0");
  const month = months[target.getMonth()];
  const year = target.getFullYear();

  return `${month} ${day}, ${year} - ${target.getHours()}:${String(target.getMinutes()).padStart(2, "0")}`;
}
