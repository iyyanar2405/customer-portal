import { DoughnutChartModel } from '@customer-portal/shared';

export interface DoughnutChartWithStatus extends DoughnutChartModel {
  isSuccess: boolean;
}
