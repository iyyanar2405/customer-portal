import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  NotificationFilterKey,
  NotificationListStoreService,
} from '@customer-portal/data-access/notifications';
import {
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-notification-filter',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
  ],
  providers: [NotificationListStoreService],
  templateUrl: './notification-filter.component.html',
  styleUrl: './notification-filter.component.scss',
})
export class NotificationFilterComponent implements OnInit, OnDestroy {
  public filterTypes = NotificationFilterKey;

  constructor(
    public notificationListStoreService: NotificationListStoreService,
  ) {}

  ngOnInit(): void {
    this.notificationListStoreService.loadNotificationFilterList();
  }

  onFilterChange(data: unknown, key: NotificationFilterKey): void {
    this.notificationListStoreService.updateNotificationFilterByKey(data, key);
  }

  ngOnDestroy(): void {
    this.notificationListStoreService.clearNotificationFilter();
  }
}
