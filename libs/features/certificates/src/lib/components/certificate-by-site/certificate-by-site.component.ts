import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { CertificateGraphsStoreService } from '@customer-portal/data-access/certificates';
import { TreeTableComponent } from '@customer-portal/shared';

@Component({
  selector: 'lib-certificates-by-site',
  imports: [CommonModule, TranslocoModule, TreeTableComponent],
  templateUrl: './certificate-by-site.component.html',
  styleUrl: './certificate-by-site.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateBySiteComponent
  implements OnInit, OnDestroy, OnInit, OnDestroy
{
  public scrollableColumns = computed(
    () =>
      this.certificateGraphsStoreService.certificateBySiteColumns()[
        'scrollableColumns'
      ],
  );
  public frozenColumns = computed(
    () =>
      this.certificateGraphsStoreService.certificateBySiteColumns()[
        'frozenColumns'
      ],
  );

  constructor(
    public certificateGraphsStoreService: CertificateGraphsStoreService,
  ) {}

  ngOnInit(): void {
    this.certificateGraphsStoreService.loadCertificatesGraphsData();
  }

  ngOnDestroy(): void {
    this.certificateGraphsStoreService.resetCertificatesGraphData();
  }
}
