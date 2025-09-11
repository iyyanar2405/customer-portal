import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

@Component({
  selector: 'lib-certificate-suspension-message-modal-footer',
  imports: [CommonModule, TranslocoDirective, SharedButtonComponent],
  templateUrl: './certificate-suspension-message-modal-footer.component.html',
  styleUrl: './certificate-suspension-message-modal-footer.component.scss',
})
export class CertificateSuspensionMessageModalFooterComponent
  implements OnDestroy
{
  sharedButtonType = SharedButtonType;

  constructor(private ref: DynamicDialogRef) {}

  closeDialog(data: boolean): void {
    this.ref.close(data);
  }

  ngOnDestroy(): void {
    this.ref.close();
  }
}
