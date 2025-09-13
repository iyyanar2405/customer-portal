import { BaseApolloResponse } from "@customer-portal/shared";

export interface FindingGraphsFilterSitesDataDto {
  id: number;
  label: string;
  children?: FindingGraphsFilterSitesDataDto[];
}

export interface FindingStatusByCategoryGraphData extends BaseApolloResponse<FindingStatusByCategoryGraphData> {
  data: FindingStatusByCategoryGraphData;
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
