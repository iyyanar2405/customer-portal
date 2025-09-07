import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, map, tap } from 'rxjs';

import { UnreadActionsStoreService } from '@customer-portal/data-access/actions';
import {
  downloadFileFromByteArray,
  getToastContentBySeverity,
  ToastSeverity,
} from '@customer-portal/shared';

import {
  ScheduleCalendarInviteCalendarAttributesDto,
  ScheduleCalendarInviteDto,
  ScheduleCalendarRescheduleReasonDto,
} from '../dtos';
import {
  ScheduleCalendarInviteCalendarAttributesModel,
  ScheduleCalendarRescheduleReasonModel,
} from '../models';
import {
  ScheduleCalendarActionMapper,
  ScheduleCalendarActionService,
} from '../services';
import {
  LoadScheduleCalendarAddToCalendar,
  LoadScheduleCalendarAddToCalendarSuccess,
  LoadScheduleCalendarRescheduleReasons,
  LoadScheduleCalendarRescheduleReasonsSuccess,
  LoadScheduleCalendarShareInvite,
  LoadScheduleCalendarShareInviteSuccess,
  UpdateScheduleCalendarConfirm,
  UpdateScheduleCalendarConfirmError,
  UpdateScheduleCalendarConfirmSuccess,
  UpdateScheduleCalendarReschedule,
  UpdateScheduleCalendarRescheduleError,
  UpdateScheduleCalendarRescheduleSuccess,
} from './actions';

export interface ScheduleCalendarActionStateModel {
  rescheduleReasonList: ScheduleCalendarRescheduleReasonModel[];
}

const defaultState: ScheduleCalendarActionStateModel = {
  rescheduleReasonList: [],
};

@State<ScheduleCalendarActionStateModel>({
  name: 'scheduleCalendarAction',
  defaults: defaultState,
})
@Injectable()
export class ScheduleCalendarActionState {
  constructor(
    private messageService: MessageService,
    private scheduleCalendarActionService: ScheduleCalendarActionService,
    private ts: TranslocoService,
    private unreadActionsStoreService: UnreadActionsStoreService,
  ) {}

  @Action(LoadScheduleCalendarAddToCalendar)
  loadScheduleCalendarAddToCalendar(
    ctx: StateContext<ScheduleCalendarActionStateModel>,
    { siteAuditId }: LoadScheduleCalendarAddToCalendar,
  ) {
    return this.getScheduleCalendarAddToCalendar(siteAuditId).pipe(
      tap(({ icsResponse }) =>
        ctx.dispatch(new LoadScheduleCalendarAddToCalendarSuccess(icsResponse)),
      ),
    );
  }

  @Action(LoadScheduleCalendarAddToCalendarSuccess)
  loadScheduleCalendarAddToCalendarSuccess(
    _: StateContext<ScheduleCalendarActionStateModel>,
    { icsResponse }: LoadScheduleCalendarAddToCalendarSuccess,
  ) {
    this.getScheduleCalendarAddToCalendarIcsDownload(icsResponse);
    this.messageService.add(getToastContentBySeverity(ToastSeverity.Success));
  }

  @Action(LoadScheduleCalendarShareInvite)
  loadScheduleCalendarShareInvite(
    ctx: StateContext<ScheduleCalendarActionStateModel>,
    { siteAuditId }: LoadScheduleCalendarShareInvite,
  ) {
    return this.getScheduleCalendarShareInvite(siteAuditId).pipe(
      tap(({ icsResponse, calendarAttributes }) =>
        ctx.dispatch(
          new LoadScheduleCalendarShareInviteSuccess(
            icsResponse,
            ScheduleCalendarActionMapper.mapToScheduleCalendarInviteCalendarAttributesModel(
              calendarAttributes as ScheduleCalendarInviteCalendarAttributesDto,
            ),
          ),
        ),
      ),
    );
  }

  @Action(LoadScheduleCalendarShareInviteSuccess)
  loadScheduleCalendarShareInviteSuccess(
    _: StateContext<ScheduleCalendarActionStateModel>,
    { icsResponse, calendarAttributes }: LoadScheduleCalendarShareInviteSuccess,
  ) {
    this.getScheduleCalendarAddToCalendarIcsDownload(icsResponse);
    this.getScheduleCalendarShareInviteMailTo(calendarAttributes);
  }

  @Action(LoadScheduleCalendarRescheduleReasons)
  loadScheduleCalendarRescheduleReasons(
    ctx: StateContext<ScheduleCalendarActionStateModel>,
  ) {
    return this.getScheduleCalendarRescheduleReasons().pipe(
      tap((data) =>
        ctx.dispatch(
          new LoadScheduleCalendarRescheduleReasonsSuccess(
            ScheduleCalendarActionMapper.mapToScheduleCalendarRescheduleReasonModel(
              data,
            ),
          ),
        ),
      ),
    );
  }

  @Action(LoadScheduleCalendarRescheduleReasonsSuccess)
  loadScheduleCalendarRescheduleReasonsSuccess(
    ctx: StateContext<ScheduleCalendarActionStateModel>,
    { rescheduleReasonList }: LoadScheduleCalendarRescheduleReasonsSuccess,
  ) {
    ctx.patchState({
      rescheduleReasonList,
    });
  }

  @Action(UpdateScheduleCalendarConfirm)
  updateScheduleCalendarConfirm(
    ctx: StateContext<ScheduleCalendarActionStateModel>,
    { siteAuditId }: UpdateScheduleCalendarConfirm,
  ) {
    return this.scheduleCalendarActionService
      .editScheduleCalendarConfirm(siteAuditId)
      .pipe(
        tap(() => ctx.dispatch(new UpdateScheduleCalendarConfirmSuccess())),
        catchError(() =>
          ctx.dispatch(new UpdateScheduleCalendarConfirmError()),
        ),
      );
  }

  @Action(UpdateScheduleCalendarConfirmSuccess)
  updateScheduleCalendarConfirmSuccess() {
    const message = getToastContentBySeverity(ToastSeverity.Success);
    message.summary = this.ts.translate('schedules.confirm.success');
    this.messageService.add(message);
    this.unreadActionsStoreService.loadUnreadActions();
  }

  @Action(UpdateScheduleCalendarConfirmError)
  updateScheduleCalendarConfirmError() {
    const message = getToastContentBySeverity(ToastSeverity.Error);
    message.summary = this.ts.translate('schedules.confirm.error');
    this.messageService.add(message);
  }

  @Action(UpdateScheduleCalendarReschedule)
  updateScheduleCalendarReschedule(
    ctx: StateContext<ScheduleCalendarActionStateModel>,
    {
      additionalComments,
      rescheduleDate,
      rescheduleReason,
      siteAuditId,
      weekNumber,
    }: UpdateScheduleCalendarReschedule,
  ) {
    return this.scheduleCalendarActionService
      .editScheduleCalendarReschedule(
        additionalComments,
        rescheduleDate,
        rescheduleReason,
        siteAuditId,
        weekNumber,
      )
      .pipe(
        tap(() => ctx.dispatch(new UpdateScheduleCalendarRescheduleSuccess())),
        catchError(() =>
          ctx.dispatch(new UpdateScheduleCalendarRescheduleError()),
        ),
      );
  }

  @Action(UpdateScheduleCalendarRescheduleSuccess)
  updateScheduleCalendarRescheduleSuccess() {
    const message = getToastContentBySeverity(ToastSeverity.Success);
    message.summary = this.ts.translate('schedules.reschedule.success');
    this.messageService.add(message);
  }

  @Action(UpdateScheduleCalendarRescheduleError)
  updateScheduleCalendarRescheduleError() {
    const message = getToastContentBySeverity(ToastSeverity.Error);
    message.summary = this.ts.translate('schedules.reschedule.error');
    this.messageService.add(message);
  }

  private getScheduleCalendarAddToCalendar(siteAuditId: number) {
    return this.scheduleCalendarActionService
      .getScheduleCalendarAddToCalendar(siteAuditId)
      .pipe(
        map((dto: ScheduleCalendarInviteDto) =>
          dto.isSuccess && dto.data ? dto.data : { icsResponse: [] },
        ),
      );
  }

  private getScheduleCalendarShareInvite(siteAuditId: number) {
    return this.scheduleCalendarActionService
      .getScheduleCalendarShareInvite(siteAuditId)
      .pipe(
        map((dto: ScheduleCalendarInviteDto) =>
          dto.isSuccess && dto.data ? dto.data : { icsResponse: [] },
        ),
      );
  }

  private getScheduleCalendarRescheduleReasons() {
    return this.scheduleCalendarActionService
      .getScheduleCalendarRescheduleReasons()
      .pipe(
        map((dto: ScheduleCalendarRescheduleReasonDto) =>
          dto.isSuccess && dto.data ? dto.data : [],
        ),
      );
  }

  private getScheduleCalendarAddToCalendarIcsDownload(icsResponse: number[]) {
    downloadFileFromByteArray(
      icsResponse,
      'Calendar.ics',
      'application/octet-stream',
    );
  }

  private getScheduleCalendarShareInviteMailTo(
    calendarAttributes: ScheduleCalendarInviteCalendarAttributesModel,
  ) {
    const {
      auditType,
      endDate,
      leadAuditor,
      service,
      site,
      siteAddress,
      siteRepresentative,
      startDate,
    } = calendarAttributes;

    const subject = `Invite: Audit Schedule ${startDate} - ${endDate}`;
    const body =
      `Dear,\n\n` +
      `Kindly consider this invite for Audit Scheduled on ${startDate} - ${endDate}.\n\n` +
      `Service: ${service}\n` +
      `Audit Type: ${auditType}\n` +
      `Auditor: ${leadAuditor}\n` +
      `Site: ${site}\n` +
      `Address: ${siteAddress}\n` +
      `Site Representative: ${siteRepresentative}\n\n` +
      `Kindly attach the invitation file downloaded.`;
    const href = `mailto:${''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }
}
