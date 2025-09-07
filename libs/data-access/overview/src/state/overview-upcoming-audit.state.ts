import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';

import {
  getToastContentBySeverity,
  ToastSeverity,
} from '@customer-portal/shared';

import {
  OverviewUpcomingAuditEvent,
  OverviewUpcomingAuditsStateModel,
} from '../models';
import { OverviewUpcomingAuditService } from '../services';
import { OverviewUpcomingAuditMapperService } from '../services/mappers/overview-upcoming-audit-mapper.service';
import { LoadOverviewUpcomingAuditEvents } from './actions';

export interface OverviewUpcomingAuditStateModel {
  events: OverviewUpcomingAuditEvent[];
  selectedYear: number;
  selectedMonth: number;
}

const defaultState: OverviewUpcomingAuditStateModel = {
  events: [],
  selectedYear: 0,
  selectedMonth: 0,
};

@State<OverviewUpcomingAuditsStateModel>({
  name: 'overviewUpcomingAudits',
  defaults: defaultState,
})
@Injectable()
export class OverviewUpcomingAuditsState {
  constructor(
    private overviewUpcomingAuditService: OverviewUpcomingAuditService,
    private messageService: MessageService,
  ) {}

  @Action(LoadOverviewUpcomingAuditEvents)
  loadOverviewUpcomingAuditEvents(
    ctx: StateContext<OverviewUpcomingAuditsStateModel>,
    { selectedMonth, selectedYear }: LoadOverviewUpcomingAuditEvents,
  ) {
    return this.overviewUpcomingAuditService
      .getOverviewUpcomingAuditEvents(selectedMonth, selectedYear)
      .pipe(
        tap((response) => {
          const formattedEvents =
            response.data?.length > 0
              ? OverviewUpcomingAuditMapperService.mapToOverviewUpcomingAudit(
                  response.data[0],
                )
              : [];

          ctx.patchState({
            events: formattedEvents,
            selectedMonth,
            selectedYear,
          });
        }),
        catchError(() => {
          this.messageService.add(
            getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
          );

          return of([]);
        }),
      );
  }
}
