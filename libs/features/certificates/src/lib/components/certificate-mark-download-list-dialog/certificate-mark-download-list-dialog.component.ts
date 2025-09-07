import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  CertificateDetailsStoreService,
  CertificationMarksListItemModel,
} from '@customer-portal/data-access/certificates';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import {
  ColumnDefinition,
  getToastContentBySeverity,
  GridComponent,
  GridFileActionType,
  SharedButtonComponent,
  SharedButtonType,
  ToastSeverity,
} from '@customer-portal/shared';

import { CERTIFICATE_MARKS_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-download-dialog',
  providers: [DialogService],
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedButtonComponent,
    GridComponent,
  ],
  templateUrl: './certificate-mark-download-list-dialog.component.html',
  styleUrl: './certificate-mark-download-list-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateMarkDownloadListDialogComponent implements OnInit {
  certificationMarks!: Signal<CertificationMarksListItemModel[]>;

  cols: ColumnDefinition[] = CERTIFICATE_MARKS_LIST_COLUMNS;
  sharedButtonType = SharedButtonType;

  constructor(
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    private certificateDetailsStoreService: CertificateDetailsStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {}

  ngOnInit(): void {
    this.certificationMarks =
      this.certificateDetailsStoreService.allCertificationMarks;
  }

  onClose(): void {
    this.ref.close(true);
  }

  triggerFileAction(event: any): void {
    const {
      fileName,
      event: { actionType, url },
    } = event;

    if (actionType === GridFileActionType.Download) {
      this.certificateDetailsStoreService.downloadCertificationMark(
        url,
        fileName,
      );

      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.DownloadStart),
      );
    }
  }
}
