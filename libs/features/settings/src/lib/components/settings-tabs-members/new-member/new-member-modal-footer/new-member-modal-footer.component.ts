import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings';
import {
  getToastContentBySeverity,
  SharedButtonComponent,
  SharedButtonType,
  ToastSeverity,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-new-member-modal-footer',
  imports: [SharedButtonComponent, TranslocoDirective],
  templateUrl: './new-member-modal-footer.component.html',
  styleUrl: './new-member-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMemberModalFooterComponent {
  sharedButtonType = SharedButtonType;
  isAddMemberFormValid: Signal<boolean>;

  constructor(
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private settingsMembersStoreService: SettingsMembersStoreService,
  ) {
    this.isAddMemberFormValid =
      this.settingsMembersStoreService.isAddMemberFormValid;
  }

  closeDialog(data: boolean): void {
    this.ref.close(data);
  }

  onSubmit(): void {
    if (!this.isAddMemberFormValid()) {
      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.FormIsMandatory),
      );
    } else {
      this.ref.close(true);
    }
  }
}
