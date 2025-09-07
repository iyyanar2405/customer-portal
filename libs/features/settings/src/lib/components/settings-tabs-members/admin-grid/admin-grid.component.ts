import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  OnDestroy,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, take, tap } from 'rxjs';

import {
  SettingsCoBrowsingStoreService,
  SettingsMembersStoreService,
} from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  buttonStyleClass,
  ColumnDefinition,
  GridComponent,
  GridConfig,
  GridEventAction,
  GridEventActionType,
  modalBreakpoints,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared';

import { MEMBERS_LIST_COLUMNS } from '../../../constants';
import {
  ManagePermissionsModalComponent,
  ManagePermissionsModalFooterComponent,
} from '../manage-permissions-modal';

@Component({
  selector: 'lib-admin-grid',
  imports: [CommonModule, GridComponent],
  templateUrl: './admin-grid.component.html',
  styleUrl: './admin-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGridComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  public shouldPersist = input<boolean>(true);

  cols: ColumnDefinition[] = MEMBERS_LIST_COLUMNS;
  ref: DynamicDialogRef | undefined;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.settingsMembersStoreService.loadSettingsAdminList();
    }),
  );

  constructor(
    public settingsMembersStoreService: SettingsMembersStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private translocoService: TranslocoService,
    private confirmationService: ConfirmationService,
  ) {
    super();

    this.settingsMembersStoreService.loadSettingsAdminList();

    this.initializePreferences(
      PageName.SettingsAdmin,
      ObjectName.Admin,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.settingsMembersStoreService.updateAdminGridConfig(gridConfig);
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  onEventActionTrigger(data: { event: GridEventAction }): void {
    const { actionType, id } = data.event;

    const handlers: Partial<Record<GridEventActionType, () => void>> = {
      [GridEventActionType.Remove]: () =>
        this.confirmRemoveMember(id as string),
      [GridEventActionType.ManagePermissions]: () =>
        this.handleManagePermissions(id),
      [GridEventActionType.ViewPortalAs]: () =>
        this.settingsCoBrowsingStoreService.updateImpersonatedUser(
          id as string,
        ),
    };

    const handler = handlers[actionType];

    if (handler) {
      handler();
    }
  }

  handleManagePermissions(id: string | number): void {
    this.ref = this.dialogService.open(ManagePermissionsModalComponent, {
      header: this.translocoService.translate(
        'settings.membersTab.managePermissions',
      ),
      width: '50vw',
      contentStyle: { overflow: 'auto', padding: '0' },
      breakpoints: modalBreakpoints,
      data: {
        showBackBtn: false,
        memberEmail: id,
        isAdmin: true,
      },
      templates: {
        footer: ManagePermissionsModalFooterComponent,
      },
    });

    this.handleManagePermissionsCloseModal();
  }

  handleManagePermissionsCloseModal(): void {
    this.ref?.onClose.pipe(take(1)).subscribe((data: boolean) => {
      if (data) {
        this.settingsMembersStoreService.submitManageMembersPermissions();
      } else {
        this.settingsMembersStoreService.discardMemberPermissionsDataAndCompanies();
        this.settingsMembersStoreService.discardMemberPermissionsUserSelection();
      }
    });
  }

  ngOnDestroy(): void {
    this.settingsMembersStoreService.resetAdminListState();
  }

  private confirmRemoveMember(memberEmail: string): void {
    this.confirmationService.confirm({
      header: this.translocoService.translate(
        'settings.membersTab.removeUser.header',
      ),
      message: this.translocoService.translate(
        'settings.membersTab.removeUser.message',
      ),
      acceptLabel: this.translocoService.translate(
        'settings.membersTab.removeUser.yes',
      ),
      rejectLabel: this.translocoService.translate(
        'settings.membersTab.removeUser.no',
      ),
      acceptButtonStyleClass: [
        buttonStyleClass.noIcon,
        buttonStyleClass.danger,
      ].join(' '),
      rejectButtonStyleClass: [
        buttonStyleClass.noIcon,
        buttonStyleClass.outlined,
      ].join(' '),
      accept: () => {
        this.settingsMembersStoreService.removeMember(memberEmail);
      },
    });
  }

  @HostBinding('class.persist') get persistClass() {
    return this.shouldPersist();
  }
}
