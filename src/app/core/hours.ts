/**
 * Opening hours as stored in content/site.json (T2), e.g.
 *   [{ "days": [1, 2, 3, 4, 5, 6, 7], "open": "07:00", "close": "18:00" }]
 * Days are ISO weekdays (1 = Monday … 7 = Sunday), so each locale names them itself.
 */
export interface OpeningHours {
  readonly days: readonly number[];
  readonly open: string;
  readonly close: string;
}

// 2024-01-01 was a Monday.
const weekday = (day: number, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(
    Date.UTC(2024, 0, day),
  );

/** One line per entry: "Monday–Saturday: 07:00–18:00". */
export function formatHours(hours: readonly OpeningHours[], locale: string): string[] {
  return hours.map(({ days, open, close }) => {
    const sorted = [...days].sort((a, b) => a - b);
    const consecutive = sorted.every((day, i) => i === 0 || day === sorted[i - 1] + 1);
    const names =
      consecutive && sorted.length > 2
        ? `${weekday(sorted[0], locale)}–${weekday(sorted[sorted.length - 1], locale)}`
        : sorted.map((day) => weekday(day, locale)).join(', ');
    return `${names}: ${open}–${close}`;
  });
}
