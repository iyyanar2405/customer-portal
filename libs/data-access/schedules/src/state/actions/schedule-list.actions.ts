import { GridConfig } from '@customer-portal/shared';

import { ScheduleListItemModel } from '../../models';

export class LoadScheduleList {
  static readonly type = '[Schedule List] Load Schedule List';
}

export class LoadScheduleListSuccess {
  static readonly type = '[Schedule List] Load Schedule List Succes';

  constructor(public schedules: ScheduleListItemModel[]) {}
}

export class UpdateGridConfig {
  static readonly type = '[Schedule List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Schedule List] Update Filter Options';
}

export class ExportSchedulesExcel {
  static readonly type = '[Schedule List] Export Schedules Excel';
}

export class ExportSchedulesExcelSuccess {
  static readonly type = '[Schedule List] Export Schedules Excel Success';

  constructor(public input: number[]) {}
}

export class ExportSchedulesExcelFail {
  static readonly type = '[Schedule List] Export Schedules Excel Fail';
}

export class ResetScheduleListState {
  static readonly type = '[Schedule List] Reset Schedules List State';
}
