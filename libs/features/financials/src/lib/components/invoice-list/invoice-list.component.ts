import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, tap } from 'rxjs';

import {
  InvoiceParams,
  LoggingService,
  ServiceNowService,
} from '@customer-portal/core';
import {
  InvoiceListItemModel,
  InvoiceListStoreService,
  isInvoiceOverdueOrUnpaid,
} from '@customer-portal/data-access/financials';
import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  DebounceClickDirective,
  getToastContentBySeverity,
  GridComponent,
  GridConfig,
  GridEventAction,
  GridEventActionType,
  GridFileActionEvent,
  GridFileActionType,
  INVOICES_STATUS_MAP,
  ObjectName,
  ObjectType,
  PageName,
  SharedButtonComponent,
  SharedButtonType,
  ToastSeverity,
} from '@customer-portal/shared';

import { INVOICE_LIST_COLUMNS } from '../../constants';
import { InvoiceEventService } from '../../services';

@Component({
  selector: 'lib-invoice-list',
  imports: [
    CommonModule,
    GridComponent,
    TranslocoDirective,
    SharedButtonComponent,
    DebounceClickDirective,
  ],
  providers: [DialogService, InvoiceEventService, InvoiceListStoreService],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  private selectedOverdueOrUnpaidIds: (string | number)[] = [];
  private selectedInvoiceIds: string[] = [];

  statusMap = INVOICES_STATUS_MAP;
  cols: ColumnDefinition[] = INVOICE_LIST_COLUMNS;
  displayDownloadButton = false;
  displayUpdatePlannedPaymentDateButton = false;
  sharedButtonType = SharedButtonType;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.invoiceListStoreService.loadInvoiceList();
    }),
  );

  constructor(
    public invoiceListStoreService: InvoiceListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private invoiceEventService: InvoiceEventService,
    private overviewSharedStoreService: OverviewSharedStoreService,
    private ts: TranslocoService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.FinancialList,
      ObjectName.Financials,
      ObjectType.Grid,
    );
    const financialStatus =
      this.overviewSharedStoreService.overviewFinancialStatus();
    this.invoiceListStoreService.applyNavigationFilters(financialStatus);
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.invoiceListStoreService.updateGridConfig(gridConfig);
  }

  onTriggerEventAction({ event }: { event: GridEventAction }): void {
    const { id, actionType } = event;

    if (actionType === GridEventActionType.UpdateReferenceNumber) {
      this.invoiceEventService.updateReferenceNumber(id);
    }

    if (actionType === GridEventActionType.UpdatePlannedPaymentDate) {
      this.invoiceEventService.openUpdatePaymentDateModal([id]);
    }

    if (actionType === GridEventActionType.RequestChanges) {
      this.openInvoiceServiceNowSupport(id);
    }
  }

  onTriggerFileAction({
    event,
    rowData,
  }: {
    event: GridFileActionEvent;
    fileName: string;
    documentId: number;
    rowData?: any;
  }): void {
    if (event.actionType === GridFileActionType.Download) {
      this.invoiceListStoreService.downloadInvoices([rowData.invoiceId]);
    }
  }

  onSelectionChangeData(selectedInvoices: InvoiceListItemModel[]) {
    this.displayDownloadButton = selectedInvoices?.length > 0;
    this.selectedInvoiceIds = selectedInvoices.map(
      (invoice) => invoice.invoiceId,
    );

    const overdueOrUnpaidInvoices = selectedInvoices.filter((invoice) =>
      isInvoiceOverdueOrUnpaid(invoice),
    );

    this.displayUpdatePlannedPaymentDateButton =
      !this.settingsCoBrowsingStoreService.isDnvUser() &&
      overdueOrUnpaidInvoices.length > 0;

    this.selectedOverdueOrUnpaidIds = overdueOrUnpaidInvoices.map(
      (invoice) => invoice.invoiceId,
    );
  }

  downloadSelectedInvoices() {
    this.invoiceListStoreService.downloadInvoices(
      this.selectedInvoiceIds,
      true,
    );
  }

  updateMultiplePlannedPaymentDate(): void {
    this.invoiceEventService.openUpdatePaymentDateModal(
      this.selectedOverdueOrUnpaidIds,
    );
  }

  onExportExcelClick() {
    this.invoiceListStoreService.exportInvoicesExcel();
  }

  ngOnDestroy(): void {
    this.invoiceListStoreService.resetInvoiceListState();
  }

  private openInvoiceServiceNowSupport(invoiceId: number | string): void {
    try {
      const invoice = this.invoiceListStoreService
        .invoices()
        .find((x) => x.invoiceId === invoiceId);

      if (!invoice) {
        throw new Error(`Invoice with ID ${invoiceId} not found`);
      }

      const invoiceServiceNowParams: InvoiceParams = {
        invoice: invoice.invoiceId,
        status: invoice.status,
        reportingCountry: invoice.reportingCountry,
        projectNumber: invoice.projectNumber,
        language: this.profileLanguageStoreService.languageLabel(),
      };
      this.serviceNowService.openInvoiceSupport(invoiceServiceNowParams);
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
