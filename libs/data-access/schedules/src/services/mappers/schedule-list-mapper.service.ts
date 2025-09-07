import {
  COLUMN_DELIMITER,
  convertToUtcDate,
  EventAction,
  EventActionItem,
  FilteringConfig,
  GridEventActionType,
  isDateInPast,
  mapFilterConfigToValues,
  utcDateToPayloadFormat,
} from '@customer-portal/shared';

import { ScheduleStatus } from '../../constants';
import {
  ScheduleExcelPayloadDto,
  ScheduleListDto,
  ScheduleListItemDto,
} from '../../dtos';
import { ScheduleListItemModel } from '../../models';

export class ScheduleListMapperService {
  static mapToScheduleListItemModel(
    dto: ScheduleListDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
  ): ScheduleListItemModel[] {
    if (!dto.data) {
      return [];
    }

    const { data } = dto;

    return data.map((scheduleItem: ScheduleListItemDto) =>
      this.mapSingleItem(
        scheduleItem,
        hasScheduleEditPermission,
        isDnvUser,
        isAdminUser,
      ),
    );
  }

  static mapToScheduleExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): ScheduleExcelPayloadDto {
    return {
      filters: {
        auditType: mapFilterConfigToValues(filterConfig, 'auditType'),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        leadAuditor: mapFilterConfigToValues(filterConfig, 'leadAuditor'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        startDate: mapFilterConfigToValues(
          filterConfig,
          'startDate',
          null,
          utcDateToPayloadFormat,
        ),
        endDate: mapFilterConfigToValues(
          filterConfig,
          'endDate',
          null,
          utcDateToPayloadFormat,
        ),
        siteRepresentative: mapFilterConfigToValues(
          filterConfig,
          'siteRepresentative',
        ),
        company: mapFilterConfigToValues(filterConfig, 'company'),
        siteAuditId: mapFilterConfigToValues(filterConfig, 'siteAuditId'),
      },
    };
  }

  private static mapSingleItem(
    item: ScheduleListItemDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
  ): ScheduleListItemModel {
    return {
      scheduleId: item.siteAuditId,
      startDate: convertToUtcDate(item.startDate),
      endDate: convertToUtcDate(item.endDate),
      status: item.status,
      service: this.joinUnique(item.services),
      site: item.site,
      city: item.city,
      auditType: item.auditType,
      leadAuditor: item.leadAuditor,
      siteRepresentative: this.joinUnique(item.siteRepresentatives),
      company: item.company,
      siteAuditId: item.siteAuditId,
      siteAddress: item.siteAddress,
      auditID: item.auditID,
      siteZip: item.siteZip,
      siteCountry: item.siteCountry,
      siteState: item.siteState,
      reportingCountry: item.reportingCountry,
      projectNumber: item.projectNumber,
      eventActions: this.buildEventActions(
        item,
        hasScheduleEditPermission,
        isDnvUser,
        isAdminUser,
      ),
    };
  }

  private static joinUnique(items: string[]): string {
    return Array.from(new Set(items)).join(COLUMN_DELIMITER);
  }

  private static areEqualStatuses(
    itemStatus: string,
    status: ScheduleStatus,
  ): boolean {
    return itemStatus.toLowerCase() === status.toLowerCase();
  }

  private static buildEventActions(
    item: ScheduleListItemDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
  ): EventAction {
    const isStartDatePast = isDateInPast(item.startDate);
    const isToBeConfirmed = this.areEqualStatuses(
      item.status,
      ScheduleStatus.ToBeConfirmed,
    );
    const isConfirmed = this.areEqualStatuses(
      item.status,
      ScheduleStatus.Confirmed,
    );

    return {
      id: item.siteAuditId,
      displayConfirmButton:
        !isDnvUser &&
        isToBeConfirmed &&
        !isStartDatePast &&
        hasScheduleEditPermission,
      displayConfirmedLabel: isConfirmed,
      actions: this.buildEventActionItems(
        item,
        hasScheduleEditPermission,
        isDnvUser,
        isAdminUser,
      ),
    };
  }

  private static buildEventActionItems(
    item: ScheduleListItemDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
  ): EventActionItem[] {
    if (this.areEqualStatuses(item.status, ScheduleStatus.ToBeConfirmedByDnv)) {
      return [];
    }

    const isScheduleInPast = isDateInPast(item.startDate);

    const actions = [
      {
        label: GridEventActionType.Reschedule,
        i18nKey: 'gridEvent.reschedule',
        icon: 'pi pi-calendar',
        disabled: isScheduleInPast,
      },
      {
        label: GridEventActionType.ShareInvite,
        i18nKey: 'gridEvent.shareInvite',
        icon: 'pi pi-share-alt',
        disabled: isScheduleInPast,
      },
      {
        label: GridEventActionType.AddToCalendar,
        i18nKey: 'gridEvent.addToCalendar',
        icon: 'pi pi-calendar-plus',
        disabled: isScheduleInPast,
      },
      {
        label: GridEventActionType.RequestChanges,
        i18nKey: 'gridEvent.requestChanges',
        icon: 'pi pi-pencil',
        disabled: !isAdminUser || isDnvUser,
      },
    ];

    const shouldExcludeReschedule =
      isDnvUser ||
      !hasScheduleEditPermission ||
      this.areEqualStatuses(item.status, ScheduleStatus.Confirmed);

    return shouldExcludeReschedule
      ? actions.filter((a) => a.label !== GridEventActionType.Reschedule)
      : actions;
  }
}
