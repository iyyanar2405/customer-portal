import { FindingStatusStatisticsDto } from './finding-status-statistics.dto';

export interface FindingsByStatusGraphDto {
  data: FindingsByStatusGraphData;
}

export interface FindingsByStatusGraphData {
  stats: FindingStatusStatisticsDto[];
  totalFindings: number;
}
