import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { SpinnerService } from '@customer-portal/core';
import { AuditDetailsStoreService } from '@customer-portal/data-access/audit';
import {
  DocType,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import {
  CustomDatePipe,
  SharedButtonComponent,
  SharedButtonType,
  STATUS_STATES_MAP,
  StatusComponent,
} from '@customer-portal/shared';

import { AuditTabViewComponent } from '../audit-tab-view/audit-tab-view.component';

@Component({
  selector: 'lib-audit-details',
  imports: [
    CommonModule,
    StatusComponent,
    AuditTabViewComponent,
    TranslocoDirective,
    SharedButtonComponent,
    CustomDatePipe,
  ],
  providers: [AuditDetailsStoreService],
  templateUrl: './audit-details.component.html',
  styleUrl: './audit-details.component.scss',
})
export class AuditDetailsComponent implements OnDestroy {
  auditDetails = this.auditDetailsStoreService.auditDetails;
  statusStatesMap = STATUS_STATES_MAP;
  sharedButtonType = SharedButtonType;
  isLoading = this.spinnerService.isLoading$;

  constructor(
    public auditDetailsStoreService: AuditDetailsStoreService,
    private documentsStoreService: DocumentsStoreService,
    private spinnerService: SpinnerService,
  ) {
    this.auditDetailsStoreService.loadAuditDetails();
  }

  get auditId(): string {
    return this.auditDetailsStoreService.auditId();
  }

  handleDownload(documentId: number[] | undefined): void {
    if (!documentId) {
      return;
    }

    this.documentsStoreService.downloadAllDocuments(documentId, DocType.Audit);
  }

  ngOnDestroy(): void {
    this.auditDetailsStoreService.resetAuditDetailsState();
  }
}
