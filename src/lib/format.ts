/**
 * Date formatting for ISO 8601 (YYYY-MM-DD) content dates. Parsed by hand
 * rather than via `new Date(iso)` on purpose: constructing a Date from a
 * date-only string parses it as UTC midnight, which then renders one day
 * early in any timezone west of UTC. These helpers are timezone-agnostic
 * — they format exactly the day/month/year written in the string.
 */

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseIsoParts(iso: string): { day: number; monthIndex: number; year: number } {
  const [year, month, day] = iso.split("-").map(Number);
  return { day, monthIndex: month - 1, year };
}

/** "2027-08-02" → "2 August 2027". */
export function formatLongDate(iso: string): string {
  const { day, monthIndex, year } = parseIsoParts(iso);
  return `${day} ${MONTHS_LONG[monthIndex]} ${year}`;
}

/** "2027-08-02" → "2 Aug 2027". */
export function formatShortDate(iso: string): string {
  const { day, monthIndex, year } = parseIsoParts(iso);
  return `${day} ${MONTHS_SHORT[monthIndex]} ${year}`;
}

/**
 * Thousands separators, computed as a pure string operation so the server
 * and client always produce identical markup (no locale-dependent Intl
 * formatting that could differ between them). 650241 → "650,241".
 */
export function formatThousands(value: number): string {
  const [whole, fraction] = value.toString().split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/**
 * "May 2026" → "June 2026"; "December 2026" → "January 2027". Used for the
 * "Planned for {next month}" heading. Returns "next month" if the input
 * isn't a recognised "<Month> <Year>" string.
 */
export function nextMonthLabel(monthYear: string): string {
  const [name, yearText] = monthYear.split(" ");
  const monthIndex = MONTHS_LONG.indexOf(name as (typeof MONTHS_LONG)[number]);
  const year = Number(yearText);
  if (monthIndex === -1 || Number.isNaN(year)) return "next month";
  const nextIndex = (monthIndex + 1) % 12;
  const nextYear = monthIndex === 11 ? year + 1 : year;
  return `${MONTHS_LONG[nextIndex]} ${nextYear}`;
}
