import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionTypes,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-schedule-calendar-details-modal-footer',
  imports: [CommonModule, TranslocoDirective, SharedButtonComponent],
  templateUrl: './schedule-calendar-details-modal-footer.component.html',
  styleUrl: './schedule-calendar-details-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmScheduleDetailsStoreService],
})
export class ScheduleCalendarDetailsModalFooterComponent {
  public isConfirmVisible = computed(
    () =>
      this.confirmScheduleDetailsStoreService.calendarDetails().status ===
      ScheduleStatus.ToBeConfirmed,
  );
  public isRescheduleVisible = computed(
    () =>
      this.confirmScheduleDetailsStoreService.calendarDetails().status ===
      ScheduleStatus.ToBeConfirmed,
  );
  public sharedButtonType = SharedButtonType;

  constructor(
    private readonly confirmScheduleDetailsStoreService: ConfirmScheduleDetailsStoreService,
    private readonly ref: DynamicDialogRef,
  ) {}

  onConfirm(): void {
    this.ref.close(ScheduleCalendarActionTypes.Confirm);
  }

  onReschedule(): void {
    this.ref.close(ScheduleCalendarActionTypes.Reschedule);
  }
}
