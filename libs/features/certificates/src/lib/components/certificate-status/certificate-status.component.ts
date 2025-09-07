import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { CertificateGraphsStoreService } from '@customer-portal/data-access/certificates';
import {
  ChartComponent,
  ChartFilter,
  chartTotalPlugin,
  ChartTypeEnum,
} from '@customer-portal/shared';

import {
  CERTIFICATES_BY_STATUS_GRAPH_OPTIONS,
  CERTIFICATES_BY_TYPE_GRAPH_OPTIONS,
} from '../../constants';

@Component({
  selector: 'lib-certificates-status',
  imports: [CommonModule, TranslocoModule, ChartComponent],
  templateUrl: './certificate-status.component.html',
  styleUrl: './certificate-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateStatusComponent implements OnInit, OnDestroy {
  certificatesByStatusChartOptions = CERTIFICATES_BY_STATUS_GRAPH_OPTIONS;
  certificatesByTypeChartOptions = CERTIFICATES_BY_TYPE_GRAPH_OPTIONS;
  barType = ChartTypeEnum.Bar;
  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];
  doughnutType = ChartTypeEnum.Doughnut;
  certificatesByStatusChartFilters: ChartFilter = {
    bodyFilter: 'status',
  };
  certificatesByTypeChartFilters: ChartFilter = {
    titleFilter: 'service',
    bodyFilter: 'status',
  };

  constructor(
    public readonly certificateGraphsStoreService: CertificateGraphsStoreService,
  ) {}

  ngOnInit(): void {
    this.certificateGraphsStoreService.loadCertificatesGraphsData();
  }

  ngOnDestroy(): void {
    this.certificateGraphsStoreService.resetCertificatesGraphData();
  }
}
