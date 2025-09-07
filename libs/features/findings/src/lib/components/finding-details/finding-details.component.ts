import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';

import { SpinnerService } from '@customer-portal/core';
import { FindingDetailsStoreService } from '@customer-portal/data-access/findings';
import {
  CustomDatePipe,
  FINDINGS_STATUS_STATES_MAP,
  StatusComponent,
} from '@customer-portal/shared';

import { FindingTabViewComponent } from '../finding-tab-view/finding-tab-view.component';

@Component({
  selector: 'lib-finding-details',
  imports: [
    CommonModule,
    StatusComponent,
    TranslocoDirective,
    FindingTabViewComponent,
    RouterModule,
    CustomDatePipe,
  ],
  providers: [FindingDetailsStoreService],
  templateUrl: './finding-details.component.html',
  styleUrls: ['./finding-details.component.scss'],
})
export class FindingDetailsComponent implements OnDestroy {
  findingDetails = this.findingDetailsStoreService.findingDetails;
  isFindingResponseFormDirty$ =
    this.findingDetailsStoreService.isFindingResponseFormDirty;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  isLoading = this.spinnerService.isLoading$;

  constructor(
    public findingDetailsStoreService: FindingDetailsStoreService,
    public confirmationService: ConfirmationService,
    private spinnerService: SpinnerService,
  ) {
    this.findingDetailsStoreService.loadFindingDetails();
  }

  get findingId(): string {
    return this.findingDetailsStoreService.findingId();
  }

  ngOnDestroy(): void {
    this.findingDetailsStoreService.resetFindingDetailsState();
  }
}
