import { DateTime } from 'luxon';

import { OpenFindingsMonthsPeriod } from '../models';

export const getOpenFindingsDateRange = (
  period: OpenFindingsMonthsPeriod,
): { startDate: Date; endDate: Date } => {
  const now = DateTime.now();

  const periodRanges: Record<
    OpenFindingsMonthsPeriod,
    { startOffset: number | null; endOffset: number }
  > = {
    [OpenFindingsMonthsPeriod.EarlyStage]: { startOffset: 30, endOffset: 0 },
    [OpenFindingsMonthsPeriod.InProgress]: { startOffset: 60, endOffset: 31 },
    [OpenFindingsMonthsPeriod.BecomingOverdue]: {
      startOffset: 90,
      endOffset: 61,
    },
    [OpenFindingsMonthsPeriod.Overdue]: { startOffset: null, endOffset: 91 },
  };

  const { startOffset, endOffset } = periodRanges[period];
  const startDate =
    startOffset !== null
      ? now.minus({ days: startOffset }).toJSDate()
      : new Date(0);

  const endDate = now.minus({ days: endOffset }).toJSDate();

  return { startDate, endDate };
};
