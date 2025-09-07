export interface OverviewCardsDto {
  data: OverviewCardItemDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface YearValue {
  count: number;
  seq: number;
  statusValue: string;
  totalCount: number;
}

export interface OverviewCardYearDatum {
  year: number;
  values: YearValue[];
}

export interface OverviewCardItemDto {
  serviceName: string;
  yearData: OverviewCardYearDatum[];
}
