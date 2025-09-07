import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  CertificateDetailsStoreService,
  CertificateDocumentsListItemModel,
} from '@customer-portal/data-access/certificates';
import {
  DocType,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import {
  ColumnDefinition,
  GridComponent,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

import { CERTIFICATE_DOCUMENTS_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-documents',
  imports: [
    CommonModule,
    GridComponent,
    TranslocoDirective,
    SharedButtonComponent,
  ],
  templateUrl: './certificate-documents.component.html',
  styleUrl: './certificate-documents.component.scss',
})
export class CertificateDocumentsComponent implements OnInit {
  cols: ColumnDefinition[] = CERTIFICATE_DOCUMENTS_COLUMNS;
  documentsList = this.certificateDetailsStoreService.certificateDocumentsList;
  displayDownloadButton = false;
  selectedDocumentsIds: number[] = [];
  sharedButtonType = SharedButtonType;

  constructor(
    public certificateDetailsStoreService: CertificateDetailsStoreService,
    private documentsStoreService: DocumentsStoreService,
  ) {}

  ngOnInit(): void {
    this.certificateDetailsStoreService.loadCertificateDocumentsList();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.certificateDetailsStoreService.updateCertificateDocumentsListGridConfig(
      gridConfig,
    );
  }

  triggerFileAction({
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

  onSelectionChangeData(
    selectedDocuments: CertificateDocumentsListItemModel[],
  ): void {
    this.displayDownloadButton = selectedDocuments?.length > 0;

    if (this.displayDownloadButton) {
      this.selectedDocumentsIds = selectedDocuments.map(
        (doc) => doc.documentId,
      );
    }
  }

  downloadSelectedDocuments(): void {
    this.documentsStoreService.downloadAllDocuments(
      this.selectedDocumentsIds,
      DocType.Certificate,
    );
  }
}
