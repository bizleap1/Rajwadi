export function getEstimatedDeliveryRange(days = 7): {
  fromFormatted: string;
  toFormatted: string;
  rangeString: string;
} {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + days);

  const formatFull = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formattedDate = formatFull(targetDate);

  return {
    fromFormatted: "Within 7 Days",
    toFormatted: formattedDate,
    rangeString: `Within 7 Days (by ${formattedDate})`,
  };
}
