import { Selector } from '@ngxs/store';

import { DoughnutChartModel } from '@customer-portal/shared';

import {
  OverviewFinancialStatusState,
  OverviewFinancialStatusStateModel,
} from '../overview-financial-status.state';

export class OverviewFinancialStatusSelectors {
  @Selector([OverviewFinancialStatusState])
  static overviewFinancialStatusGraphData(
    state: OverviewFinancialStatusStateModel,
  ): DoughnutChartModel {
    return state.overviewFinancialStatusGraphData;
  }

  @Selector([OverviewFinancialStatusState])
  static overviewFinancialStatusError(
    state: OverviewFinancialStatusStateModel,
  ): boolean {
    return state.overviewFinancialStatusError;
  }
}
