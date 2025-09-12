import { DateTime, IANAZone } from 'luxon';

import { DEFAULT_DATE_FORMAT } from '../../constants';

/**
 * Converts a string in dd-mm-yyyy format to a Date object.
 * @param dateString The date string in dd-mm-yyyy format.
 * @returns The Date object corresponding to the input string.
 */
export const convertStringToDate = (dateString: string): Date => {
  const trimmedDateString = dateString.trim();
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;

  if (!dateRegex.test(trimmedDateString)) {
    throw new Error(
      'Invalid date string format. Date string must be in dd-mm-yyyy format.',
    );
  }

  const [day, month, year] = trimmedDateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const [parsedDay, parsedMonth, parsedYear] = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
  ];

  if (day !== parsedDay || month !== parsedMonth || year !== parsedYear) {
    throw new Error(
      'Invalid date. The resulting date does not match the input string.',
    );
  }

  return date;
};

const getYearBounds = (
  year: string,
): { firstDay: DateTime; lastDay: DateTime } => {
  const yearNum = parseInt(year, 10);

  if (Number.isNaN(yearNum)) {
    throw new Error('Invalid year input');
  }

  return {
    firstDay: DateTime.fromObject({ year: yearNum, month: 1, day: 1 }),
    lastDay: DateTime.fromObject({ year: yearNum, month: 12, day: 31 }),
  };
};

export const getYearBoundsAsDates = (year: string) => {
  const { firstDay, lastDay } = getYearBounds(year);

  return { firstDay: firstDay.toJSDate(), lastDay: lastDay.toJSDate() };
};

export const getYearBoundsAsStrings = (
  year: string,
  format = DEFAULT_DATE_FORMAT,
) => {
  const { firstDay, lastDay } = getYearBounds(year);

  return {
    firstDay: firstDay.toFormat(format),
    lastDay: lastDay.toFormat(format),
  };
};

export const convertToUtcDate = (
  inputDateTime?: string,
  format = DEFAULT_DATE_FORMAT,
): string => {
  if (!inputDateTime) {
    return '';
  }

  const dateTime = DateTime.fromISO(inputDateTime, { zone: 'utc' });

  return dateTime.toFormat(format);
};

export const dateToFormat = (
  inputDate: Date,
  format = DEFAULT_DATE_FORMAT,
): string => {
  const dateTime = DateTime.fromJSDate(inputDate);

  return dateTime.isValid ? dateTime.toFormat(format) : '';
};

export const utcDateToPayloadFormat = (
  inputDate: string,
  format = 'yyyy-MM-dd',
): string => {
  const parsedDate = DateTime.fromFormat(inputDate, DEFAULT_DATE_FORMAT);

  return parsedDate.toFormat(format);
};

export const extractTimeFromIsoDate = (inputDateTime?: string): string => {
  if (!inputDateTime) {
    return '';
  }

  const dateTime = DateTime.fromISO(inputDateTime, { zone: 'utc' });

  return dateTime.toFormat('HH:mm');
};

export const formatDateToGivenZoneAndFormat = (
  inputDateTime: string,
  zone: string,
  format = `${DEFAULT_DATE_FORMAT} HH:mm`,
): string => {
  if (!inputDateTime) {
    return '';
  }

  const localDateTime = DateTime.fromISO(inputDateTime).setZone(zone);

  return localDateTime.toFormat(format);
};

export const formatDateToGivenZoneAndLocale = (
  utcDate: string,
  timeZone: string,
  locale: string,
): string =>
  DateTime.fromISO(utcDate)
    .setZone(timeZone)
    .setLocale(locale)
    .toLocaleString(DateTime.DATE_SHORT);

export const isDateInPast = (date: string): boolean =>
  new Date(date).getTime() < new Date(new Date()).getTime();

export const calculateWeekRange = (date: Date): [Date, Date] => {
  const inputDate = new Date(date);

  const dayOfWeek = inputDate.getDay();

  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  let startOfWeek = new Date(inputDate);
  startOfWeek.setDate(inputDate.getDate() - diffToMonday);

  const today = new Date();

  if (startOfWeek < today) {
    startOfWeek = today;
  }

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + (7 - endOfWeek.getDay()));

  return [startOfWeek, endOfWeek];
};

export const getDateMinusDays = (daysOffset: number): Date => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysOffset);

  return currentDate;
};

export const getMonthStartEnd = (
  monthName: string,
): { startDate: Date; endDate: Date } => {
  const currentYear = DateTime.now().year;
  const monthDate = DateTime.fromFormat(monthName.toLowerCase(), 'LLLL', {
    locale: 'en',
  });

  if (!monthDate.isValid) {
    throw new Error(`Invalid month name: "${monthName}"`);
  }

  const startOfMonth = DateTime.local(currentYear, monthDate.month, 1);
  const endOfMonth = startOfMonth.endOf('month');

  return {
    startDate: startOfMonth.toJSDate(),
    endDate: endOfMonth.toJSDate(),
  };
};

export const getDateWithoutTimezone = (date: Date): string => {
  const tzoffset = date.getTimezoneOffset() * 60000;
  const withoutTimezone = new Date(date.valueOf() - tzoffset).toISOString();

  return withoutTimezone;
};

export const formatUtcToLocal = (
  inputDateTime: string,
  localZone: string,
  dateFormat = DEFAULT_DATE_FORMAT,
): string => {
  if (!inputDateTime) return '';

  const dt = DateTime.fromISO(inputDateTime, { zone: 'utc' });

  if (!dt.isValid) {
    console.error('Invalid date:', inputDateTime, dt.invalidReason);

    return '';
  }

  if (!IANAZone.isValidZone(localZone)) {
    console.error('Invalid timezone:', localZone);

    return dt.toFormat(dateFormat);
  }

  return dt.setZone(localZone).toFormat(dateFormat);
};

export const utcDateInPast = (date: string): boolean => {
  const targetDateUtc = DateTime.fromISO(date, {
    zone: 'utc',
    setZone: true,
  }).startOf('day');
  const todayUtc = DateTime.now().setZone('utc').startOf('day');

  return targetDateUtc < todayUtc;
};

export const utcDateInFuture = (date: string): boolean => {
  const targetDateUtc = DateTime.fromISO(date, {
    zone: 'utc',
    setZone: true,
  }).startOf('day');
  const todayUtc = DateTime.now().setZone('utc').startOf('day');

  return targetDateUtc > todayUtc;
};

export function formatCustomDate(value: string): string {
  if (!value) return '';

  const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}T/);

  if (isoMatch) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }
    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('en-US', { month: 'short' });
    const year = String(date.getFullYear());

    return `${day}-${monthShort}-${year}`;
  }

  const parts = value.includes('-') ? value.split('-') : value.split('.');
  if (parts.length !== 3) return value;

  const [day, month, year] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return value;
  }

  const monthShort = date.toLocaleString('en-US', { month: 'short' });

  return `${day.padStart(2, '0')}-${monthShort}-${year}`;
}
