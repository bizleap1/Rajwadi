export function getEstimatedDeliveryRange(daysFrom = 5, daysTo = 7): {
  fromFormatted: string;
  toFormatted: string;
  rangeString: string;
} {
  const now = new Date();

  const addBusinessDays = (startDate: Date, days: number): Date => {
    const result = new Date(startDate);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        // Skip Sunday and Saturday
        added++;
      }
    }
    return result;
  };

  const fromDate = addBusinessDays(now, daysFrom);
  const toDate = addBusinessDays(now, daysTo);

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
