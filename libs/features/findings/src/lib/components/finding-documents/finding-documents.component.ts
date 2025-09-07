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
  DocType,
  DocumentsStoreService,
  UploadDocumentsSuccess,
} from '@customer-portal/data-access/documents';
import {
  FindingDetailsStoreService,
  FindingDocumentListItemModel,
  FindingsFileUploadService,
} from '@customer-portal/data-access/findings';
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

import { FINDINGS_DOCUMENTS_COLUMNS } from '../../constants';

enum FileUploadErrors {
  Error_001 = 'findings.fileUpload.fileUploadWrongName',
  Error_002 = 'findings.fileUpload.fileUploadFailed',
  Error_003 = 'findings.fileUpload.fileUploadWrongSize',
  Error_004 = 'findings.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'findings.fileUpload.fileUploadGenericError',
}

const FILE_UPLOAD_SUCCESS = 'findings.fileUpload.fileUploadSuccess';

@Component({
  selector: 'lib-finding-documents',
  imports: [
    CommonModule,
    SharedButtonComponent,
    DynamicDialogModule,
    GridComponent,
    TranslocoDirective,
    MessagesModule,
  ],
  providers: [DialogService, FindingsFileUploadService],
  templateUrl: './finding-documents.component.html',
  styleUrl: './finding-documents.component.scss',
})
export class FindingDocumentsComponent implements OnDestroy {
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);

  findingId = this.findingDetailsStoreService.findingId();
  cols: ColumnDefinition[] = FINDINGS_DOCUMENTS_COLUMNS;
  ref: DynamicDialogRef | undefined;
  displayDownloadButton = false;
  selectedDocumentsIds: number[] = [];
  sharedButtonType = SharedButtonType;

  documentsList = this.findingDetailsStoreService.documentsList;
  findingDetails = this.findingDetailsStoreService.findingDetails;
  isFindingOpenOrAccepted =
    this.findingDetailsStoreService.isFindingOpenOrAccepted;
  hasFindingsEditPermission = this.profileStoreService.hasPermission(
    PermissionCategories.Findings,
    PermissionsList.Edit,
  );
  isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser;

  canAddDocument = computed(
    () =>
      !this.isDnvUser() &&
      this.isFindingOpenOrAccepted() &&
      this.hasFindingsEditPermission(),
  );

  constructor(
    public dialogService: DialogService,
    public findingDetailsStoreService: FindingDetailsStoreService,
    private ts: TranslocoService,
    private confirmationService: ConfirmationService,
    private documentsStoreService: DocumentsStoreService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    this.findingDetailsStoreService.loadFindingDocumentsList();

    this.documentsStoreService.loadUploadDocumentsInfo(
      '/FindingDocumentUpload',
      FileUploadErrors,
      FILE_UPLOAD_SUCCESS,
      this.findingDetailsStoreService.auditId() || '',
    );

    this.actions$
      .pipe(
        ofActionSuccessful(UploadDocumentsSuccess),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.findingDetailsStoreService.loadFindingDocumentsList();
      });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.findingDetailsStoreService.updateGridConfig(gridConfig);
  }

  openAddDocumentsDialog(): void {
    this.ref = this.dialogService.open(AddDocumentsComponent, {
      header: this.ts.translate('findings.attachedDocuments.addDocument'),
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: modalBreakpoints,
      data: {
        canUploadData: false,
        errorMessages: {
          wrongFileSize: 'findings.fileUpload.fileUploadWrongSize',
          wrongFileType: 'findings.fileUpload.fileUploadWrongType',
          wrongFileNameLength: 'findings.fileUpload.fileUploadWrongNameLength',
          wrongTotalFileSize: 'findings.fileUpload.fileUploadWrongSize',
        } as ErrorMessages,
      },
      templates: {
        footer: AddDocumentsFooterComponent,
      },
    });
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
        header: this.ts.translate('findings.deleteDocument.header'),
        message: this.ts.translate('findings.deleteDocument.message'),
        acceptLabel: this.ts.translate('findings.confirmationPopup.delete'),
        rejectLabel: this.ts.translate('findings.confirmationPopup.cancel'),
        acceptButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.danger,
        ].join(' '),
        rejectButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.outlined,
        ].join(' '),
        accept: () => {
          const serviceName = 'findingsId';
          this.documentsStoreService
            .deleteDocument(serviceName, this.findingId, documentId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.findingDetailsStoreService.loadFindingDocumentsList(),
            );
        },
      });
    }
  }

  onSelectionChangeData(
    selectedDocuments: FindingDocumentListItemModel[],
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
      DocType.Finding,
    );
  }
}
