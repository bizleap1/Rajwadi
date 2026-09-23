export function getEstimatedDeliveryRange(daysFrom = 5, daysTo = 7): {
  fromFormatted: string;
  toFormatted: string;
  rangeString: string;
} {
  const now = new Date();

  const addDays = (startDate: Date, days: number): Date => {
    const result = new Date(startDate);
    result.setDate(result.getDate() + days);
    return result;
  };

  const fromDate = addDays(now, daysFrom);
  const toDate = addDays(now, daysTo);

  const formatDayMonth = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatFull = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return {
    fromFormatted: formatDayMonth(fromDate),
    toFormatted: formatFull(toDate),
    rangeString: `${formatDayMonth(fromDate)} – ${formatFull(toDate)}`,
  };
}
