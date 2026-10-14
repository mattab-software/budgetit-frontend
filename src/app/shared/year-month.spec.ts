import { addMonths, currentYearMonth, formatYearMonth, isYearMonth } from './year-month';

describe('year-month', () => {
  it('validates the YYYY-MM format', () => {
    expect(isYearMonth('2026-10')).toBe(true);
    expect(isYearMonth('2026-1')).toBe(false);
    expect(isYearMonth('2026-13')).toBe(false);
    expect(isYearMonth('2026-00')).toBe(false);
    expect(isYearMonth('garbage')).toBe(false);
    expect(isYearMonth(null)).toBe(false);
  });

  it('returns the current month with a zero-padded month', () => {
    expect(currentYearMonth(new Date(2026, 2, 15))).toBe('2026-03');
  });

  it('adds and subtracts months across year boundaries', () => {
    expect(addMonths('2026-10', 1)).toBe('2026-11');
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2026-01', -1)).toBe('2025-12');
    expect(addMonths('2026-05', -17)).toBe('2024-12');
    expect(addMonths('2026-05', 24)).toBe('2028-05');
  });

  it('formats a human-readable label', () => {
    expect(formatYearMonth('2026-10', 'en-US')).toBe('October 2026');
  });

  it('rejects invalid input', () => {
    expect(() => addMonths('2026-13', 1)).toThrow();
  });
});
