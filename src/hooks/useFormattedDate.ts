import { useMemo } from "react";
import { formatDate } from "../utils/formatDate";

export function useFormattedDate(input: Date | number | string) {
  return useMemo(() => formatDate(input), [input]);
}
