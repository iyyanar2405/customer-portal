import { TimeRange } from '../../models';

const getMonthCurrent = () => new Date().getUTCMonth();

const getYearCurrent = () => new Date().getUTCFullYear();

export const getTimeModRange = (range: TimeRange) => {
  switch (range) {
    case TimeRange.MonthPrevious: {
      const year = getYearCurrent();
      const month = getMonthCurrent() - 1;

      return [
        new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.MonthCurrent: {
      const year = getYearCurrent();
      const month = getMonthCurrent();

      return [
        new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.MonthNext: {
      const year = getYearCurrent();
      const month = getMonthCurrent() + 1;

      return [
        new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.YearPrevious: {
      const year = getYearCurrent() - 1;

      return [
        new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.YearCurrent: {
      const year = getYearCurrent();

      return [
        new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.YearNext: {
      const year = getYearCurrent() + 1;

      return [
        new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.YearCustom: {
      const yearStart = getYearCurrent() + 1 - 4;
      const yearEnd = getYearCurrent() + 2 - 1;

      return [
        new Date(Date.UTC(yearStart, 0, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(yearEnd, 11, 31, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.Custom: {
      const yearStart = getYearCurrent() - 3;
      const yearEnd = getYearCurrent() + 1;

      return [
        new Date(Date.UTC(yearStart, 0, 1, 0, 0, 0, 0)),
        new Date(Date.UTC(yearEnd, 11, 31, 23, 59, 59, 999)),
      ];
    }

    case TimeRange.YearCustom5Years: {
      const now = new Date();
      const start = new Date(Date.UTC(now.getFullYear() - 5, 0, 1, 0, 0, 0, 0));
      const end = new Date(
        Date.UTC(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      );

      return [start, end];
    }
    default:
      return [];
  }
};

export const getCurrentYearRange = () => {
  const year = new Date().getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
  const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  return { startOfYear, endOfYear };
};

export const getCurrentYearMinus5Range = () => {
  const year = new Date().getFullYear() - 5;
  const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
  const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  return { startOfYear, endOfYear };
};

export const toUtcRange = (range: Date[]): [Date, Date] => {
  const start = new Date(
    Date.UTC(
      range[0].getFullYear(),
      range[0].getMonth(),
      range[0].getDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const end = new Date(
    Date.UTC(
      range[1].getFullYear(),
      range[1].getMonth(),
      range[1].getDate(),
      23,
      59,
      59,
      999,
    ),
  );

  return [start, end];
};
