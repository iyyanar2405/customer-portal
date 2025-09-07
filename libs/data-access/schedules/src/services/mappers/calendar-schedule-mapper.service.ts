import { TreeNode } from 'primeng/api';

import {
  COLUMN_DELIMITER,
  SharedSelectMultipleDatum,
} from '@customer-portal/shared';

import {
  CalendarScheduleDataDto,
  ScheduleCalendarFilterDataDto,
} from '../../dtos';
import { CalendarScheduleModel } from '../../models';

const SITE_REPRESENTATIVES_DELIMITER = ', ';

export class CalendarScheduleMapperService {
  static mapToCalendarScheduleModel(
    data: CalendarScheduleDataDto[],
  ): CalendarScheduleModel[] {
    return data.map((calendarScheduleItem: CalendarScheduleDataDto) => ({
      address: calendarScheduleItem.siteAddress,
      auditType: calendarScheduleItem.auditType,
      city: calendarScheduleItem.city,
      company: calendarScheduleItem.company,
      endDate: calendarScheduleItem.endDate,
      leadAuditor: calendarScheduleItem.leadAuditor,
      scheduleId: String(calendarScheduleItem.siteAuditId),
      service: calendarScheduleItem.services?.join(COLUMN_DELIMITER) || '',
      site: calendarScheduleItem.site,
      siteRepresentative:
        calendarScheduleItem.siteRepresentatives?.join(
          SITE_REPRESENTATIVES_DELIMITER,
        ) || '',
      startDate: calendarScheduleItem.startDate,
      status: calendarScheduleItem.status,
    }));
  }

  static mapToScheduleCalendarFilterList(
    data: ScheduleCalendarFilterDataDto[],
  ): SharedSelectMultipleDatum<number>[] {
    return data.map((datum) => ({
      label: datum.label,
      value: datum.id,
    }));
  }

  static mapToScheduleCalendarFilterTree(
    data: ScheduleCalendarFilterDataDto[],
  ): TreeNode[] {
    return this.getScheduleCalendarFilterTree(data);
  }

  private static getScheduleCalendarFilterTree(
    data: ScheduleCalendarFilterDataDto[],
  ): TreeNode[] {
    return data.map((datum) => ({
      data: datum.id,
      key: `${datum.id}-${datum.label}`,
      label: datum.label,
      children: datum?.children?.length
        ? this.getScheduleCalendarFilterTree(datum.children)
        : undefined,
    }));
  }
}
