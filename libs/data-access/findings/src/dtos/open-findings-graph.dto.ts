import { OpenFindingsStatisticsDto } from './open-findings-statistics.dto';

export interface OpenFindingsGraphDto {
  data: OpenFindingsGraphData;
}

export interface OpenFindingsGraphData {
  services: OpenFindingsStatistics[];
}

export interface OpenFindingsStatistics {
  service: string;
  categories: OpenFindingsStatisticsDto[];
}
