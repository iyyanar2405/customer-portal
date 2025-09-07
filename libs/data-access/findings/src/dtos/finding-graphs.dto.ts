export interface FindingGraphsFilterCompaniesDto {
  data: FindingGraphsFilterCompaniesDataDto[];
  isSuccess: boolean;
}

export interface FindingGraphsFilterCompaniesDataDto {
  id: number;
  label: string;
}

export interface FindingGraphsFilterServicesDto {
  data: FindingGraphsFilterServicesDataDto[];
  isSuccess: boolean;
}

export interface FindingGraphsFilterServicesDataDto {
  id: number;
  label: string;
}

export interface FindingGraphsFilterSitesDto {
  data: FindingGraphsFilterSitesDataDto[];
  isSuccess: boolean;
}

export interface FindingGraphsFilterSitesDataDto {
  id: number;
  label: string;
  children?: FindingGraphsFilterSitesDataDto[];
}

export interface FindingStatusByCategoryGraphDto {
  data: FindingStatusByCategoryGraphData;
}

export interface FindingStatusByCategoryGraphData {
  stats: FindingStatusByCategoryStatistics[];
}

export interface FindingStatusByCategoryStatistics {
  category: string;
  statuses: FindingStatisticsDto[];
}

export interface FindingStatisticsDto {
  status: string;
  count: number;
}
