import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { FilterValue } from '@customer-portal/shared';

import {
  OverviewFinancialNavigateToListView,
  OverviewUpcomingSetSelectedDate,
  ResetOverviewSharedState,
  SetFinancialStatusChartNavigationPayload,
} from '../actions';
import { OverviewSharedState } from '../overview-shared.state';
import { OverviewSharedSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class OverviewSharedStoreService {
  constructor(private store: Store) {}

  get overviewUpcomingAuditSelectedDate(): Signal<Date | undefined> {
    return this.store.selectSignal(OverviewSharedSelectors.getSelectedDate);
  }

  get overviewFinancialStatus(): Signal<FilterValue[]> {
    return this.store.selectSignal(
      OverviewSharedState.getSelectedFinancialStatus,
    );
  }

  @Dispatch()
  setSelectedDate = (date: Date | undefined) =>
    new OverviewUpcomingSetSelectedDate(date);

  @Dispatch()
  navigateFromChartToListView = (filters: FilterValue[]) =>
    new OverviewFinancialNavigateToListView(filters);

  @Dispatch()
  setFinancialStatusChartNavigationPayload = (state: FilterValue[]) =>
    new SetFinancialStatusChartNavigationPayload(state);

  @Dispatch()
  resetOverviewSharedState = () => new ResetOverviewSharedState();
}
