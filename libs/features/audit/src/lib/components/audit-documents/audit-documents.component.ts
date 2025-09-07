import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';

import {
  AuditDetailsStoreService,
  AuditDocumentListItemModel,
  AuditFileUploadService,
} from '@customer-portal/data-access/audit';
import {
  DocType,
  DocumentsStoreService,
  UploadDocumentsSuccess,
} from '@customer-portal/data-access/documents';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  AddDocumentsComponent,
  AddDocumentsFooterComponent,
} from '@customer-portal/features/upload';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import {
  buttonStyleClass,
  ColumnDefinition,
  ErrorMessages,
  GridComponent,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
  modalBreakpoints,
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

import { AUDIT_DOCUMENTS_COLUMNS } from '../../constants';

enum FileUploadErrors {
  Error_001 = 'audit.fileUpload.fileUploadWrongName',
  Error_002 = 'audit.fileUpload.fileUploadFailed',
  Error_003 = 'audit.fileUpload.fileUploadWrongSize',
  Error_004 = 'audit.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'audit.fileUpload.fileUploadGenericError',
}

const FILE_UPLOAD_SUCCESS = 'audit.fileUpload.fileUploadSuccess';

@Component({
  selector: 'lib-audit-documents',
  imports: [
    CommonModule,
    SharedButtonComponent,
    DynamicDialogModule,
    GridComponent,
    TranslocoDirective,
    MessagesModule,
  ],
  providers: [DialogService, AuditFileUploadService],
  templateUrl: './audit-documents.component.html',
  styleUrl: './audit-documents.component.scss',
})
export class AuditDocumentsComponent implements OnDestroy {
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);

  auditId = this.auditDetailsStoreService.auditId();
  cols: ColumnDefinition[] = AUDIT_DOCUMENTS_COLUMNS;
  ref: DynamicDialogRef | undefined;
  displayDownloadButton = false;
  selectedDocumentsIds: number[] = [];
  sharedButtonType = SharedButtonType;
  canAddDocuments = computed(
    () =>
      !this.settingsCoBrowsingStoreService.isDnvUser() &&
      this.profileStoreService.hasPermission(
        PermissionCategories.Audits,
        PermissionsList.Edit,
      )(),
  );

  auditDetails = this.auditDetailsStoreService.auditDetails;
  auditDocumentsList = this.auditDetailsStoreService.auditDocumentsList;

  constructor(
    public auditDetailsStoreService: AuditDetailsStoreService,
    private dialogService: DialogService,
    private ts: TranslocoService,
    private confirmationService: ConfirmationService,
    private documentsStoreService: DocumentsStoreService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    this.auditDetailsStoreService.loadAuditDocumentsList();

    this.documentsStoreService.loadUploadDocumentsInfo(
      '/AuditDocumentUpload',
      FileUploadErrors,
      FILE_UPLOAD_SUCCESS,
    );

    this.actions$
      .pipe(
        ofActionSuccessful(UploadDocumentsSuccess),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.auditDetailsStoreService.loadAuditDocumentsList();
      });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  openAddDocumentsDialog(): void {
    this.ref = this.dialogService.open(AddDocumentsComponent, {
      header: this.ts.translate('audit.attachedDocuments.addDocument'),
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: modalBreakpoints,
      data: {
        canUploadData: false,
        errorMessages: {
          wrongFileSize: 'audit.fileUpload.fileUploadWrongSize',
          wrongFileType: 'audit.fileUpload.fileUploadWrongType',
          wrongFileNameLength: 'audit.fileUpload.fileUploadWrongNameLength',
          wrongTotalFileSize: 'audit.fileUpload.fileUploadWrongSize',
        } as ErrorMessages,
      },
      templates: {
        footer: AddDocumentsFooterComponent,
      },
    });
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateAuditDocumentsListGridConfig(
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
    } else if (event.actionType === GridFileActionType.Delete) {
      this.confirmationService.confirm({
        header: this.ts.translate('audit.deleteDocument.header'),
        message: this.ts.translate('audit.deleteDocument.message'),
        acceptLabel: this.ts.translate('audit.deleteDocument.delete'),
        rejectLabel: this.ts.translate('audit.deleteDocument.cancel'),
        acceptButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.danger,
        ].join(' '),
        rejectButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.outlined,
        ].join(' '),
        accept: () => {
          const serviceName = 'auditId';
          this.documentsStoreService
            .deleteDocument(serviceName, this.auditId, documentId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.auditDetailsStoreService.loadAuditDocumentsList(),
            );
        },
      });
    }
  }

  onSelectionChangeData(selectedDocuments: AuditDocumentListItemModel[]): void {
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
      DocType.Audit,
    );
  }
}
