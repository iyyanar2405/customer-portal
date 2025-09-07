import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { filter, tap } from 'rxjs';

import {
  CERTIFICATE_STATUS_MAP,
  CertificateListStoreService,
} from '@customer-portal/data-access/certificates';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  GridComponent,
  GridConfig,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared';

import { CERTIFICATE_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-list',
  imports: [CommonModule, GridComponent],
  providers: [CertificateListStoreService],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.scss',
})
export class CertificateListComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  statusMap = CERTIFICATE_STATUS_MAP;
  cols: ColumnDefinition[] = CERTIFICATE_LIST_COLUMNS;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.certificateListStoreService.loadCertificateList();
    }),
  );

  constructor(
    public certificateListStoreService: CertificateListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.CertificateList,
      ObjectName.Certificates,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.certificateListStoreService.updateGridConfig(gridConfig);
  }

  ngOnDestroy(): void {
    this.certificateListStoreService.resetCertificateListState();
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }
}
