import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { filter, tap } from 'rxjs';

import { SettingsTab } from '@customer-portal/data-access/settings';

import { SettingsTabsCompanyDetailsComponent } from '../settings-tabs-company-details';
import { SettingsTabsMembersComponent } from '../settings-tabs-members';
import { SettingsTabsPersonalInformationComponent } from '../settings-tabs-personal-information';

@Component({
  selector: 'lib-settings-tabs',
  imports: [
    CommonModule,
    RouterModule,
    TabViewModule,
    TranslocoDirective,
    SettingsTabsCompanyDetailsComponent,
    SettingsTabsMembersComponent,
    SettingsTabsPersonalInformationComponent,
  ],
  templateUrl: './settings-tabs.component.html',
  styleUrl: './settings-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsComponent implements OnInit {
  private readonly settingsTabMapping: SettingsTab[] = [
    SettingsTab.PersonalInformation,
    SettingsTab.CompanyDetails,
    SettingsTab.Members,
  ];

  public tabIndex = 0;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter((params: any) => params.tab),
        tap(({ tab }) => {
          this.tabIndex = this.settingsTabMapping.indexOf(tab);
          this.ref.markForCheck();
        }),
      )
      .subscribe();
  }

  onTabChange(event: TabViewChangeEvent): void {
    const queryParams: Params = {
      tab: this.settingsTabMapping[event.index],
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
