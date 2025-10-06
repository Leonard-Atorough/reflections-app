import { useMemo } from "react";

export function useFormattedDate(input?: Date | number | string) {
  return useMemo(() => {
    const days: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const now = new Date();
    const target = input ? new Date(input) : now;
    if (Number.isNaN(target.getTime())) {
      throw new Error("Invalid date supplied to 'formaDate()' function");
    }

    const getFullDaySpan = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const msPerDay = 24 * 60 * 60 * 1000;

    const diff = (getFullDaySpan(now) - getFullDaySpan(target)) / msPerDay;

    if (diff >= 0 && diff <= 6) {
      return days.at(target.getDay());
    }

    const day = String(target.getDate()).padStart(2, "0");
    const month = String(target.getMonth() + 1).padStart(2, "0");
    const year = target.getFullYear();

    return `${day}/${month}/${year}`;
  }, [input]);
}
