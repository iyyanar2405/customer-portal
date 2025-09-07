import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';

import {
  CertificateGraphsStoreService,
  CertificatesTabs,
} from '@customer-portal/data-access/certificates';

import { CertificateBySiteComponent } from '../certificate-by-site';
import { CertificateStatusComponent } from '../certificate-status';

@Component({
  selector: 'lib-certificate-graphs-tab-view',
  imports: [
    CommonModule,
    TabViewModule,
    TranslocoDirective,
    CertificateBySiteComponent,
    CertificateStatusComponent,
  ],
  templateUrl: './certificate-graphs-tab-view.component.html',
  styleUrl: './certificate-graphs-tab-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateGraphsTabViewComponent {
  private readonly tabsMapping: CertificatesTabs[] = [
    CertificatesTabs.CertificatesStatus,
    CertificatesTabs.CertificatesBySite,
  ];

  readonly CertificatesTabs = CertificatesTabs;
  activeTab = CertificatesTabs.CertificatesStatus;

  constructor(
    private readonly certificateGraphsStoreService: CertificateGraphsStoreService,
  ) {}

  onTabChange(event: TabViewChangeEvent): void {
    this.activeTab = this.tabsMapping[event.index];
    this.certificateGraphsStoreService.setActiveCertificatesTab(this.activeTab);
  }
}
