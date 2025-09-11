import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';
import {
  FilterValue,
  TreeNodeClick,
  TreeTableComponent,
} from '@customer-portal/shared';

import { FINDINGS_CATEGORIES } from '../../constants';

const FINDINGS_BY_CLAUSE_COLUMNS = [
  {
    field: 'name',
    header: 'serviceChapterClause',
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
    field: 'v',
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
  selector: 'lib-findings-by-clause',
  imports: [CommonModule, TreeTableComponent, TranslocoDirective],
  providers: [FindingGraphsStoreService],
  templateUrl: './findings-by-clause.component.html',
  styleUrl: './findings-by-clause.component.scss',
})
export class FindingsByClauseComponent {
  readonly columns = FINDINGS_BY_CLAUSE_COLUMNS;

  constructor(
    public readonly findingGraphsStoreService: FindingGraphsStoreService,
  ) {
    this.findingGraphsStoreService.loadFindingsByClauseList();
  }

  onCellClick(data: TreeNodeClick): void {
    const selectionValues: FilterValue[] = [];

    if (data.rowNode.level === 0) {
      const value = data.rowNode?.node?.data.name;
      const label = 'services';

      selectionValues.push({ label, value: [{ label: value, value }] });

      if (
        data.field !== this.columns[0].field &&
        data.field !== this.columns[5].field
      ) {
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
}
