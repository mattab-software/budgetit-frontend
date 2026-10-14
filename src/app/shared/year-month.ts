/** A calendar month in the API format `YYYY-MM`, e.g. `2026-10` (Java's `YearMonth.toString()`). */
export type YearMonth = string;

const YEAR_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function isYearMonth(value: string | null | undefined): value is YearMonth {
  return value != null && YEAR_MONTH_PATTERN.test(value);
}

export function currentYearMonth(today: Date = new Date()): YearMonth {
  return toYearMonth(today.getFullYear(), today.getMonth() + 1);
}

export function addMonths(ym: YearMonth, delta: number): YearMonth {
  const [year, month] = parse(ym);
  const zeroBased = year * 12 + (month - 1) + delta;
  return toYearMonth(Math.floor(zeroBased / 12), (zeroBased % 12) + 1);
}

/** Human-readable label, e.g. "October 2026". */
export function formatYearMonth(ym: YearMonth, locale?: string): string {
  const [year, month] = parse(ym);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
}

function parse(ym: YearMonth): [number, number] {
  const match = YEAR_MONTH_PATTERN.exec(ym);
  if (!match) {
    throw new Error(`Invalid year-month: ${ym}`);
  }
  return [Number(match[1]), Number(match[2])];
}

function toYearMonth(year: number, month: number): YearMonth {
  return `${year}-${String(month).padStart(2, '0')}`;
}
