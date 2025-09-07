import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  convertToUtcDate,
  mapApiResponseToPageName,
} from '@customer-portal/shared';

import { NotificationListDto, NotificationsDto } from '../../dtos';
import { NotificationModel } from '../../models';

export class NotificationsListMapperService {
  static mapToNotificationsListModel(
    dto: NotificationListDto,
    domSanitizer: DomSanitizer,
  ): NotificationModel[] {
    if (!dto) {
      return [];
    }

    const { items } = dto;

    return items.map((notification: NotificationsDto) => ({
      id: notification.infoId,
      isRead: notification.readStatus,
      actionName: 'navigateFromNotification',
      title: notification.subject,
      message:
        domSanitizer.sanitize(SecurityContext.HTML, notification.message) ?? '',
      receivedOn: convertToUtcDate(notification.createdTime),
      entityType: mapApiResponseToPageName(notification.entityType),
      entityId: notification.entityId,
      actions: [
        {
          actionType: 'redirect',
          iconClass: 'pi-angle-right',
          label: 'angle-right',
          url: '',
        },
      ],
      iconTooltip: {
        displayIcon: notification.readStatus === false,
        iconClass: 'pi pi-circle-fill',
        iconPosition: 'prefix',
        tooltipMessage: 'Audit plan available',
      },
    }));
  }
}
