import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { DoughnutChartModel, EMPTY_GRAPH_DATA } from '@customer-portal/shared';

import {
  OverviewFinancialStatusMapperService,
  OverviewFinancialStatusService,
} from '../services';
import { LoadOverviewFinancialStatusData } from './actions';

export interface OverviewFinancialStatusStateModel {
  overviewFinancialStatusGraphData: DoughnutChartModel;
  overviewFinancialStatusError: boolean;
}

const defaultState: OverviewFinancialStatusStateModel = {
  overviewFinancialStatusGraphData: EMPTY_GRAPH_DATA,
  overviewFinancialStatusError: false,
};
@State<OverviewFinancialStatusStateModel>({
  name: 'financialStatus',
  defaults: defaultState,
})
@Injectable()
export class OverviewFinancialStatusState {
  constructor(
    private readonly overviewFinancialStatusService: OverviewFinancialStatusService,
  ) {}

  @Action(LoadOverviewFinancialStatusData)
  loadOverviewFinancialStatusData(
    ctx: StateContext<OverviewFinancialStatusStateModel>,
  ) {
    return this.overviewFinancialStatusService
      .getOverviewFinancialWidget()
      .pipe(
        tap((overviewFinancialStatusGraphDto) => {
          const overviewFinancialData =
            OverviewFinancialStatusMapperService.mapToOverviewFinancialStatusModel(
              overviewFinancialStatusGraphDto,
            );

          if (overviewFinancialData.isSuccess) {
            ctx.patchState({
              overviewFinancialStatusGraphData: overviewFinancialData,
              overviewFinancialStatusError: false,
            });
          } else {
            ctx.patchState({
              overviewFinancialStatusError: true,
            });
          }
        }),
        catchError(() => {
          ctx.patchState({
            overviewFinancialStatusError: true,
          });

          return of(null);
        }),
      );
  }
}
