import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  CertificateChartFilterKey,
  CertificateChartFilterStoreService,
  CertificateGraphsStoreService,
} from '@customer-portal/data-access/certificates';
import {
  getTimeRange,
  SharedSelectDateRangeComponent,
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
  TimeRange,
} from '@customer-portal/shared';

import { CertificateGraphsTabViewComponent } from '../certificate-graphs-tab-view/certificate-graphs-tab-view.component';

@Component({
  selector: 'lib-certificate-chart',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectDateRangeComponent,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
    CertificateGraphsTabViewComponent,
  ],
  providers: [
    CertificateChartFilterStoreService,
    CertificateGraphsStoreService,
  ],
  templateUrl: './certificate-chart.component.html',
  styleUrl: './certificate-chart.component.scss',
})
export class CertificateChartComponent implements OnInit, OnDestroy {
  chartFilterType = CertificateChartFilterKey;
  timeRange = TimeRange;

  constructor(
    public readonly certificateChartFilterStoreService: CertificateChartFilterStoreService,
    public readonly certificateGraphsStoreService: CertificateGraphsStoreService,
  ) {}

  ngOnInit(): void {
    this.loadGraphsFilterList();
  }

  onFilterChange(data: unknown, key: CertificateChartFilterKey): void {
    this.certificateChartFilterStoreService.updateCertificateChartFilterByKey(
      data,
      key,
    );
    this.certificateGraphsStoreService.loadCertificatesGraphsData();
  }

  ngOnDestroy(): void {
    this.certificateGraphsStoreService.resetCertificateGraphsState();
  }

  private loadGraphsFilterList(): void {
    this.certificateChartFilterStoreService.updateCertificateChartFilterByKey(
      getTimeRange(TimeRange.YearCurrent),
      CertificateChartFilterKey.TimeRange,
    );
    this.certificateChartFilterStoreService.loadCertificateChartFilterList();
  }
}
