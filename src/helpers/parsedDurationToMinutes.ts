export function parseDurationToMinutes(value: string, unit: string): number {
  const num = Number(value);
  switch (unit) {
    case "dias":
      return num * 1440;
    case "horas":
      return num * 60;
    default:
      return num;
  }
}
