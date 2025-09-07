import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import { ScheduleListItemModel } from '../../models';
import {
  ExportSchedulesExcel,
  LoadScheduleList,
  ResetScheduleListState,
  UpdateGridConfig,
} from '../actions';
import { ScheduleListSelectors } from '../selectors';

@Injectable()
export class ScheduleListStoreService {
  constructor(private store: Store) {}

  get schedules(): Signal<ScheduleListItemModel[]> {
    return this.store.selectSignal(ScheduleListSelectors.schedules);
  }

  get schedulesList(): Signal<ScheduleListItemModel[]> {
    return this.store.selectSignal(ScheduleListSelectors.allSchedulesList);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(ScheduleListSelectors.totalFilteredRecords);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(ScheduleListSelectors.hasActiveFilters);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(ScheduleListSelectors.filterOptions);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(ScheduleListSelectors.filteringConfig);
  }

  @Dispatch()
  loadScheduleList = () => new LoadScheduleList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  resetScheduleListState = () => new ResetScheduleListState();

  @Dispatch()
  exportAuditSchedulesExcel = () => new ExportSchedulesExcel();
}
