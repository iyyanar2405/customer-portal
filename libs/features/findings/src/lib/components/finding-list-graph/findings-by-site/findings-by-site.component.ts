import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';
import {
  FilterValue,
  TreeNodeClick,
  TreeTableComponent,
} from '@customer-portal/shared';
import { FINDINGS_CATEGORIES } from '../../../constants';



const FINDINGS_BY_SITE_COLUMNS = [
  {
    field: 'name',
    header: 'country',
    isTranslatable: true,
    width: '240px',
  },
  {
    field: 'majorCount',
    header: 'majorCat',
    isTranslatable: true,
    width: '129px',
  },
  {
    field: 'minorCount',
    header: 'minorCat',
    isTranslatable: true,
    width: '129px',
  },
  {
    field: 'observationCount',
    header: 'observation',
    isTranslatable: true,
    width: '129px',
  },
  {
    field: 'toImproveCount',
    header: 'toImprove',
    isTranslatable: true,
    width: '240px',
  },
  {
    field: 'totalCount',
    header: 'total',
    isTranslatable: true,
    width: '129px',
  },
];

@Component({
  selector: 'lib-findings-by-site',
  imports: [CommonModule, TranslocoDirective, TreeTableComponent],
  providers: [FindingGraphsStoreService],
  templateUrl: './findings-by-site.component.html',
  styleUrl: './findings-by-site.component.scss',
})
export class FindingsBySiteComponent {
  readonly columns = FINDINGS_BY_SITE_COLUMNS;

  constructor(
    public readonly findingGraphsStoreService: FindingGraphsStoreService,
  ) {
    this.findingGraphsStoreService.loadFindingsGraphsData();
  }

  onCellClick(data: TreeNodeClick): void {
    if (data.rowNode.level !== 0) {
      return;
    }

    const isExcludedField =
      data.field === this.columns[0].field ||
      data.field === this.columns[5].field;

    const selectionValues: FilterValue[] = [
      {
        label: FINDINGS_BY_SITE_COLUMNS[0].header,
        value: [
          {
            label: data.rowNode.node?.data.name,
            value: data.rowNode.node?.data.name,
          },
        ],
      },
    ];

    if (!isExcludedField) {
      selectionValues.push({
        label: 'category',
        value: [
          {
            label: FINDINGS_CATEGORIES[data.field],
            value: FINDINGS_CATEGORIES[data.field],
          },
        ],
      });
    }

    this.findingGraphsStoreService.navigateFromTreeTableToListView(
      selectionValues,
    );
  }
}
