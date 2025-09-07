import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';

import {
  AppPagesEnum,
  FilterValue,
  getToastContentBySeverity,
  ToastSeverity,
} from '@customer-portal/shared';

import {
  OverviewFinancialNavigateToListView,
  OverviewUpcomingSetSelectedDate,
  ResetOverviewSharedState,
  SetFinancialStatusChartNavigationPayload,
} from './actions';

export interface OverviewSharedStateModel {
  auditCalendarSelectedDate: Date | undefined;
  financialStatusSelectedState: FilterValue[];
  chartNavigationPayload: FilterValue[];
}

const defaultState: OverviewSharedStateModel = {
  auditCalendarSelectedDate: undefined,
  financialStatusSelectedState: [
    {
      label: '',
      value: [],
    },
  ],
  chartNavigationPayload: [],
};

@State<OverviewSharedStateModel>({
  name: 'overviewShared',
  defaults: defaultState,
})
@Injectable()
export class OverviewSharedState {
  constructor(private messageService: MessageService) {}

  @Selector()
  static getSelectedFinancialStatus(
    state: OverviewSharedStateModel,
  ): FilterValue[] {
    return state.financialStatusSelectedState;
  }

  @Action(OverviewUpcomingSetSelectedDate)
  setSelectedDate(
    ctx: StateContext<OverviewSharedStateModel>,
    action: OverviewUpcomingSetSelectedDate,
  ) {
    ctx.patchState({
      auditCalendarSelectedDate: action.date,
    });

    if (action.date) {
      ctx.dispatch(new Navigate([AppPagesEnum.Schedule]));
    }
  }

  @Action(OverviewFinancialNavigateToListView)
  navigateFromChartToListView(
    ctx: StateContext<OverviewSharedStateModel>,
    action: OverviewFinancialNavigateToListView,
  ) {
    try {
      ctx.patchState({
        financialStatusSelectedState: action.tooltipFilters,
      });
      ctx.dispatch(new Navigate([AppPagesEnum.Financials]));
    } catch (error) {
      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
      );
    }
  }

  @Action(SetFinancialStatusChartNavigationPayload)
  setFinancialStatusChartNavigationPayload(
    ctx: StateContext<OverviewSharedStateModel>,
    { chartNavigationPayload }: SetFinancialStatusChartNavigationPayload,
  ) {
    ctx.patchState({
      chartNavigationPayload,
    });
  }

  @Action(ResetOverviewSharedState)
  resetOverviewSharedState(ctx: StateContext<OverviewSharedStateModel>) {
    ctx.setState(defaultState);
  }
}
