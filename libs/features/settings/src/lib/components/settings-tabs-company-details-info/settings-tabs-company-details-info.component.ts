import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Signal,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import {
  CompanySettingsParams,
  LoggingService,
  ServiceNowService,
} from '@customer-portal/core';
import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsData,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import {
  getToastContentBySeverity,
  ToastSeverity,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-settings-tab-company-details-info',
  imports: [CommonModule, TranslocoDirective, ButtonModule, TooltipModule],
  templateUrl: './settings-tabs-company-details-info.component.html',
  styleUrl: './settings-tabs-company-details-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsCompanyDetailsInfoComponent {
  public data = input.required<SettingsCompanyDetailsData>();
  public hasAccordion = input<boolean>(false);
  public isOrganizationNameVisible = input<boolean>(false);
  public isUserAdmin = input<boolean>(false);
  public isUpdatePendingParentCompany = input<boolean>(false);
  public isUpdatePendingLegalEntity = input<boolean>(false);
  public title = input<string>();
  public isLegalEntity = input<boolean>(false);
  public isButtonDisabled = computed(
    () =>
      this.isUpdatePendingParentCompany() ||
      (this.isLegalEntity() && this.isUpdatePendingLegalEntity()),
  );

  public isAccordionOpen = false;
  public isDnvUser: Signal<boolean>;

  constructor(
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private settingsStoreService: SettingsCompanyDetailsStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private readonly ts: TranslocoService,
  ) {
    this.isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser;
  }

  onAccordionToggle(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  openServiceNowCompanySettingsSupport(): void {
    try {
      const companySettingsParams: CompanySettingsParams = {
        language: this.profileLanguageStoreService.languageLabel(),
        accountID: this.settingsStoreService.parentCompany()?.accountId ?? 0,
        accountName:
          this.settingsStoreService.parentCompany()?.organizationName ?? '',
        reportingCountry:
          this.settingsStoreService.parentCompany()?.country ?? '',
        projectNumber: '',
      };
      this.serviceNowService.openCompanySettingsSupport(companySettingsParams);
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
