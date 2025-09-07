import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { filter, tap } from 'rxjs';

import {
  ContractsListItemModel,
  ContractsListStoreService,
} from '@customer-portal/data-access/contracts';
import {
  DocType,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  GridComponent,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
  ObjectName,
  ObjectType,
  PageName,
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

import { CONTRACTS_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-contract-list',
  imports: [
    CommonModule,
    TranslocoModule,
    GridComponent,
    SharedButtonComponent,
  ],
  providers: [ContractsListStoreService],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractListComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  cols: ColumnDefinition[] = CONTRACTS_LIST_COLUMNS;
  shouldDisplayDownloadBtn = false;
  selectedContractsIds: number[] = [];
  sharedButtonType = SharedButtonType;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.contractsListStoreService.loadContractsList();
    }),
  );

  constructor(
    public contractsListStoreService: ContractsListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private documentsStoreService: DocumentsStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.ContractList,
      ObjectName.Contracts,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.contractsListStoreService.updateGridConfig(gridConfig);
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  onTriggerFileAction({
    event,
    fileName,
    documentId,
  }: {
    event: GridFileActionEvent;
    fileName: string;
    documentId: number;
  }): void {
    if (event.actionType === GridFileActionType.Download) {
      this.documentsStoreService.downloadDocument(documentId, fileName);
    }
  }

  onExportExcelClick(): void {
    this.contractsListStoreService.exportContractsExcel();
  }

  onSelectionChangeData(selectedContracts: ContractsListItemModel[]): void {
    this.shouldDisplayDownloadBtn = selectedContracts?.length > 0;

    if (this.shouldDisplayDownloadBtn) {
      this.selectedContractsIds = selectedContracts.map((contract) =>
        Number(contract.contractId),
      );
    }
  }

  downloadSelectedContracts(): void {
    this.documentsStoreService.downloadAllDocuments(
      this.selectedContractsIds,
      DocType.Contract,
    );
  }

  ngOnDestroy(): void {
    this.contractsListStoreService.resetContractListState();
  }
}
