export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  }

  if (minutes < 1440) {
    const hours = minutes / 60;
    const displayHours = hours % 1 === 0 ? hours : hours.toFixed(1);
    return `${displayHours} hora${Math.ceil(hours) !== 1 ? "s" : ""}`;
  }

  const days = minutes / 1440;
  const displayDays = days % 1 === 0 ? days : days.toFixed(1);
  return `${displayDays} dia${Math.ceil(days) !== 1 ? "s" : ""}`;
}
