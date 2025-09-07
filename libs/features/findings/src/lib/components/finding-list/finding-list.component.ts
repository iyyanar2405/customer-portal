import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { filter, tap } from 'rxjs';

import { FindingsListStoreService } from '@customer-portal/data-access/findings';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  FINDINGS_STATUS_STATES_MAP,
  FINDINGS_TAG_STATES_MAP,
  GridComponent,
  GridConfig,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared';

import { FINDINGS_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-finding-list',
  imports: [CommonModule, GridComponent],
  providers: [FindingsListStoreService],
  templateUrl: './finding-list.component.html',
  styleUrl: './finding-list.component.scss',
})
export class FindingListComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  tagStatesMap = FINDINGS_TAG_STATES_MAP;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  cols: ColumnDefinition[] = FINDINGS_LIST_COLUMNS;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.findingsListStoreService.loadFindingsList();
    }),
  );

  constructor(
    public findingsListStoreService: FindingsListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    super();
    this.initializePreferences(
      PageName.FindingList,
      ObjectName.Findings,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.findingsListStoreService.updateGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    this.findingsListStoreService.exportFindingsExcel();
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  ngOnDestroy(): void {
    this.findingsListStoreService.resetFindingsListState();
  }
}
