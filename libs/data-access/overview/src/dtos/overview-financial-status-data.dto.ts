export interface OverviewFinancialStatusGraphWrapperDto {
  getWidgetforFinancials: OverviewFinancialStatusGraphDto;
}

export interface OverviewFinancialStatusGraphDto {
  data: OverviewFinancialStatusGraphDataDto[];
  isSuccess: boolean;
}

export interface OverviewFinancialStatusGraphDataDto {
  financialStatus: string;
  financialCount: number;
  financialpercentage: number;
}
