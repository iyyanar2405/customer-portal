import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  SharedButtonToggleDatum,
  SharedPageToggleComponent,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-audit',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    SharedPageToggleComponent,
  ],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditComponent {
  public pageToggleOptions: Partial<SharedButtonToggleDatum<string>>[] = [
    {
      i18nKey: 'buttons.toggle.lists',
      icon: 'list',
      label: 'Lists',
      value: './',
    },
    {
      i18nKey: 'buttons.toggle.graphs',
      icon: 'chart-pie',
      label: 'Graphs',
      value: 'graphs',
    },
  ];
}
